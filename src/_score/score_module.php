<?php
namespace Materia;

class Score_Modules_Connections extends Score_Module
{
    public function check_answer($log)
    {
        $questionID = $log->item_id;
        $userAnswer = $log->text;
        error_log("Received log with question ID: $questionID and user answer: $userAnswer");

        // Check if the question exists
        if (isset($this->questions[$questionID])) {
            $question = $this->questions[$questionID];
            $userAnswerArray = explode(',', $userAnswer); 
			//Makes it so the order does not matter when checking the descriptins
			sort($userAnswerArray);
			
            foreach ($question->answers as $answer) {
				$correctAnswerArray = $answer;
				sort($correctAnswerArray);
                if ($userAnswerArray == $correctAnswerArray) {
                    error_log("Match found for question ID: $questionID with value: {$answer['value']}");
                    return $answer['value'];
                }
            }
        } else {
            error_log("Question ID: $questionID not found in questions array");
        }

        error_log("No match found for question ID: $questionID with user answer: $userAnswer");
        return 0; 
    }

    public function finalize_score($instance, $logs)
    {
        $totalScore = 0;
        foreach ($logs as $log) {
            error_log("Processing log: " . print_r($log, true));
            $totalScore += $this->check_answer($log);
        }
        error_log("Total score after finalizing: $totalScore");
        return $totalScore;
    }
}
