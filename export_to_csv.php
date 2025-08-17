<?php

/**
 * Statamic Content to CSV Exporter
 * Exports all collections from your Statamic site to CSV files
 */

class StatamicCSVExporter
{
    private $contentPath;
    private $outputPath;
    
    public function __construct($contentPath = 'content/collections', $outputPath = 'exports')
    {
        $this->contentPath = $contentPath;
        $this->outputPath = $outputPath;
        
        if (!is_dir($this->outputPath)) {
            mkdir($this->outputPath, 0755, true);
        }
    }
    
    /**
     * Parse YAML front matter from markdown files
     */
    private function parseFrontMatter($content)
    {
        if (!preg_match('/^---\s*\n(.*?)\n---\s*\n/s', $content, $matches)) {
            return [];
        }
        
        $yaml = $matches[1];
        $data = [];
        
        // Simple YAML parser for basic key-value pairs
        $lines = explode("\n", $yaml);
        $currentKey = null;
        $currentValue = [];
        
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) continue;
            
            // Check if this is a new key (no indentation)
            if (preg_match('/^([a-zA-Z_][a-zA-Z0-9_-]*):\s*(.*)$/', $line, $matches)) {
                // Save previous key if exists
                if ($currentKey) {
                    $data[$currentKey] = $this->formatValue($currentValue);
                }
                
                $currentKey = $matches[1];
                $currentValue = [$matches[2]];
            } elseif ($currentKey && preg_match('/^\s+(.+)$/', $line, $matches)) {
                // Continuation of current key
                $currentValue[] = $matches[1];
            }
        }
        
        // Save last key
        if ($currentKey) {
            $data[$currentKey] = $this->formatValue($currentValue);
        }
        
        return $data;
    }
    
    /**
     * Format array values for CSV
     */
    private function formatValue($value)
    {
        if (is_array($value)) {
            // Join array elements with semicolon
            return implode('; ', array_filter($value));
        }
        return $value;
    }
    
    /**
     * Clean text content for CSV
     */
    private function cleanText($text)
    {
        // Remove HTML tags and normalize whitespace
        $text = strip_tags($text);
        $text = preg_replace('/\s+/', ' ', $text);
        return trim($text);
    }
    
    /**
     * Extract text content from Statamic's rich text format
     */
    private function extractTextContent($content)
    {
        if (is_string($content)) {
            return $this->cleanText($content);
        }
        
        if (is_array($content)) {
            $text = '';
            foreach ($content as $item) {
                if (isset($item['type']) && $item['type'] === 'paragraph') {
                    if (isset($item['content'])) {
                        foreach ($item['content'] as $textItem) {
                            if (isset($textItem['text'])) {
                                $text .= $textItem['text'] . ' ';
                            }
                        }
                    }
                }
            }
            return $this->cleanText($text);
        }
        
        return '';
    }
    
    /**
     * Export a single collection
     */
    public function exportCollection($collectionName)
    {
        $collectionPath = $this->contentPath . '/' . $collectionName;
        
        if (!is_dir($collectionPath)) {
            echo "Collection '$collectionName' not found.\n";
            return false;
        }
        
        $files = glob($collectionPath . '/*.md');
        $data = [];
        $headers = [];
        
        foreach ($files as $file) {
            $content = file_get_contents($file);
            $frontMatter = $this->parseFrontMatter($content);
            
            // Extract filename without extension
            $filename = basename($file, '.md');
            $frontMatter['filename'] = $filename;
            
            // Extract text content from complex fields
            if (isset($frontMatter['description'])) {
                $frontMatter['description_text'] = $this->extractTextContent($frontMatter['description']);
            }
            
            if (isset($frontMatter['quote'])) {
                $frontMatter['quote_text'] = $this->cleanText($frontMatter['quote']);
            }
            
            if (isset($frontMatter['specs'])) {
                $frontMatter['specs_text'] = $this->extractTextContent($frontMatter['specs']);
            }
            
            $data[] = $frontMatter;
            
            // Collect all possible headers
            foreach (array_keys($frontMatter) as $key) {
                if (!in_array($key, $headers)) {
                    $headers[] = $key;
                }
            }
        }
        
        // Sort headers for consistent output
        sort($headers);
        
        // Write CSV
        $csvFile = $this->outputPath . '/' . $collectionName . '.csv';
        $handle = fopen($csvFile, 'w');
        
        // Write headers
        fputcsv($handle, $headers);
        
        // Write data
        foreach ($data as $row) {
            $csvRow = [];
            foreach ($headers as $header) {
                $csvRow[] = isset($row[$header]) ? $row[$header] : '';
            }
            fputcsv($handle, $csvRow);
        }
        
        fclose($handle);
        
        echo "Exported $collectionName: " . count($data) . " items to $csvFile\n";
        return true;
    }
    
    /**
     * Export all collections
     */
    public function exportAll()
    {
        $collections = [
            'products',
            'manufacturers', 
            'news',
            'pre-owned',
            'testimonials',
            'pages',
            'evergreen-carousel'
        ];
        
        foreach ($collections as $collection) {
            $this->exportCollection($collection);
        }
        
        echo "\nAll exports completed! Check the 'exports' directory.\n";
    }
    
    /**
     * Create a summary report
     */
    public function createSummary()
    {
        $summary = [];
        $collections = [
            'products',
            'manufacturers', 
            'news',
            'pre-owned',
            'testimonials',
            'pages',
            'evergreen-carousel'
        ];
        
        foreach ($collections as $collection) {
            $csvFile = $this->outputPath . '/' . $collection . '.csv';
            if (file_exists($csvFile)) {
                $lines = file($csvFile);
                $count = count($lines) - 1; // Subtract header row
                $summary[$collection] = $count;
            }
        }
        
        $summaryFile = $this->outputPath . '/export_summary.txt';
        $content = "Statamic Content Export Summary\n";
        $content .= "Generated: " . date('Y-m-d H:i:s') . "\n\n";
        
        foreach ($summary as $collection => $count) {
            $content .= "$collection: $count items\n";
        }
        
        file_put_contents($summaryFile, $content);
        echo "Summary created: $summaryFile\n";
    }
}

// Run the exporter
echo "Starting Statamic CSV Export...\n";

$exporter = new StatamicCSVExporter();
$exporter->exportAll();
$exporter->createSummary();

echo "\nExport completed! Check the 'exports' directory for CSV files.\n"; 