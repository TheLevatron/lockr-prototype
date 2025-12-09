<?php
/**
 * JSON Database Helper Class
 * LockR Prototype - JSON file-based storage
 * Simple class to handle JSON file operations without MySQL
 */

class JsonDB {
    private $data_dir;
    
    public function __construct($data_dir = '../data/') {
        $this->data_dir = rtrim($data_dir, '/') . '/';
        
        // Create data directory if it doesn't exist
        if (!is_dir($this->data_dir)) {
            mkdir($this->data_dir, 0755, true);
        }
    }
    
    /**
     * Read and decode JSON file
     * @param string $file - Filename (e.g., 'users.json')
     * @return array - Decoded JSON data
     */
    public function read($file) {
        $filepath = $this->data_dir . $file;
        
        // Initialize file with empty structure if it doesn't exist
        if (!file_exists($filepath)) {
            $this->write($file, ['next_id' => 1, 'records' => []]);
        }
        
        $json = file_get_contents($filepath);
        $data = json_decode($json, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log("JSON decode error in $file: " . json_last_error_msg());
            return ['next_id' => 1, 'records' => []];
        }
        
        return $data;
    }
    
    /**
     * Encode and write JSON file with file locking
     * @param string $file - Filename
     * @param array $data - Data to write
     * @return bool - Success status
     */
    public function write($file, $data) {
        $filepath = $this->data_dir . $file;
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        
        // Use file locking to prevent race conditions
        $fp = fopen($filepath, 'w');
        if (flock($fp, LOCK_EX)) {
            fwrite($fp, $json);
            fflush($fp);
            flock($fp, LOCK_UN);
        }
        fclose($fp);
        
        return true;
    }
    
    /**
     * Find record by key/value
     * @param string $file - Filename
     * @param string $key - Field name to search
     * @param mixed $value - Value to match
     * @return array|null - Found record or null
     */
    public function find($file, $key, $value) {
        $data = $this->read($file);
        
        foreach ($data['records'] as $record) {
            if (isset($record[$key]) && $record[$key] == $value) {
                return $record;
            }
        }
        
        return null;
    }
    
    /**
     * Find all records matching criteria
     * @param string $file - Filename
     * @param string $key - Field name to search
     * @param mixed $value - Value to match
     * @return array - Array of matching records
     */
    public function findAll($file, $key = null, $value = null) {
        $data = $this->read($file);
        
        if ($key === null) {
            return $data['records'];
        }
        
        $results = [];
        foreach ($data['records'] as $record) {
            if (isset($record[$key]) && $record[$key] == $value) {
                $results[] = $record;
            }
        }
        
        return $results;
    }
    
    /**
     * Insert new record with auto-increment ID
     * @param string $file - Filename
     * @param array $record - Record data
     * @param string $id_field - Name of ID field (default: varies by table)
     * @return int - New record ID
     */
    public function insert($file, $record, $id_field = null) {
        $data = $this->read($file);
        
        // Determine ID field based on file
        if ($id_field === null) {
            if ($file === 'users.json') $id_field = 'user_id';
            elseif ($file === 'lockers.json') $id_field = 'locker_id';
            elseif ($file === 'reservations.json') $id_field = 'reservation_id';
            elseif ($file === 'academic_years.json') $id_field = 'year_id';
        }
        
        // Add auto-increment ID and timestamp
        $record[$id_field] = $data['next_id'];
        if (!isset($record['created_at'])) {
            $record['created_at'] = date('Y-m-d H:i:s');
        }
        
        $data['records'][] = $record;
        $data['next_id']++;
        
        $this->write($file, $data);
        
        return $record[$id_field];
    }
    
    /**
     * Update existing record by ID
     * @param string $file - Filename
     * @param mixed $id - Record ID
     * @param array $updates - Fields to update
     * @param string $id_field - Name of ID field
     * @return bool - Success status
     */
    public function update($file, $id, $updates, $id_field = null) {
        $data = $this->read($file);
        
        // Determine ID field based on file
        if ($id_field === null) {
            if ($file === 'users.json') $id_field = 'user_id';
            elseif ($file === 'lockers.json') $id_field = 'locker_id';
            elseif ($file === 'reservations.json') $id_field = 'reservation_id';
            elseif ($file === 'academic_years.json') $id_field = 'year_id';
        }
        
        $updated = false;
        foreach ($data['records'] as &$record) {
            if ($record[$id_field] == $id) {
                foreach ($updates as $key => $value) {
                    $record[$key] = $value;
                }
                $record['updated_at'] = date('Y-m-d H:i:s');
                $updated = true;
                break;
            }
        }
        
        if ($updated) {
            $this->write($file, $data);
        }
        
        return $updated;
    }
    
    /**
     * Delete record by ID
     * @param string $file - Filename
     * @param mixed $id - Record ID
     * @param string $id_field - Name of ID field
     * @return bool - Success status
     */
    public function delete($file, $id, $id_field = null) {
        $data = $this->read($file);
        
        // Determine ID field based on file
        if ($id_field === null) {
            if ($file === 'users.json') $id_field = 'user_id';
            elseif ($file === 'lockers.json') $id_field = 'locker_id';
            elseif ($file === 'reservations.json') $id_field = 'reservation_id';
            elseif ($file === 'academic_years.json') $id_field = 'year_id';
        }
        
        $original_count = count($data['records']);
        $data['records'] = array_values(array_filter($data['records'], function($record) use ($id_field, $id) {
            return $record[$id_field] != $id;
        }));
        
        $deleted = count($data['records']) < $original_count;
        
        if ($deleted) {
            $this->write($file, $data);
        }
        
        return $deleted;
    }
    
    /**
     * Count records matching criteria
     * @param string $file - Filename
     * @param string $key - Field name to filter (optional)
     * @param mixed $value - Value to match (optional)
     * @return int - Count of matching records
     */
    public function count($file, $key = null, $value = null) {
        $data = $this->read($file);
        
        if ($key === null) {
            return count($data['records']);
        }
        
        $count = 0;
        foreach ($data['records'] as $record) {
            if (isset($record[$key]) && $record[$key] == $value) {
                $count++;
            }
        }
        
        return $count;
    }
}
