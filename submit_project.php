<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['project_name'], $data['summary'], $data['functions'], $data['keywords'], $data['repo'], $data['videoLink'], $data['work'])) {
        $projectsFile = 'projects.json';

        if (file_exists($projectsFile)) {
            $jsonData = file_get_contents($projectsFile);
            $projects = json_decode($jsonData, true);

            if (!isset($projects['projects'])) {
                $projects['projects'] = [];
            }

            $newProject = [
                'project_name' => $data['project_name'],
                'summary' => $data['summary'],
                'functions' => explode(',', $data['functions']),
                'keywords' => explode(',', $data['keywords']),
                'repo' => $data['repo'],
                'videoLink' => $data['videoLink'],
                'work' => $data['work']
            ];

            $projectExists = false;

            foreach ($projects['projects'] as &$project) {
                if ($project['project_name'] === $data['project_name']) {
                    $project = $newProject;
                    $projectExists = true;
                    break;
                }
            }

            if (!$projectExists) {
                $projects['projects'][] = $newProject;
            }

            if (file_put_contents($projectsFile, json_encode($projects, JSON_PRETTY_PRINT))) {
                echo json_encode(['success' => true]);
                exit;
            }
        }
    }
}

echo json_encode(['success' => false]);
?>
