<?php
namespace Materia;

class Score_Modules_Connections extends Score_Module
{
    private function calculateAsciiSum($array)
    {
        $sum = 0;
        foreach ($array as $item) {
            foreach (str_split($item) as $char) {
                $sum += ord($char);
            }
        }
        return $sum;
    }

    public function check_answer($log)
    {
        $questionID = $log->item_id;
        $userAnswer = $log->text;
        trace($userAnswer); // Example text log is : 'Dragons,Unicorns,Fairies,Mermaids'
        trace("The question ID is : $questionID and user answer is: $userAnswer");
        trace("newchris");
        trace("Available question IDs: " . implode(',', array_keys($this->questions)));

        // Check if question exists
        if (isset($this->questions[$questionID])) {
            $question = $this->questions[$questionID];
            $userAnswerArray = explode(',', $userAnswer);

            $correctAnswerArray = array_map(function ($a) {
                return $a['text'];
            }, $question->answers);

            $userAsciiSum = $this->calculateAsciiSum($userAnswerArray);
            $correctAsciiSum = $this->calculateAsciiSum($correctAnswerArray);

            trace("User ASCII sum: " . $userAsciiSum);
            trace("Correct ASCII sum: " . $correctAsciiSum);

            if ($userAsciiSum == $correctAsciiSum) {
                trace("Match found successfully for question ID: $questionID");
                return 100 / count($this->questions); // Assuming equal weight for each question
            }
        } else {
            trace("SORRY Question ID: $questionID not found in questions array");
        }

        trace("GET PWN\'D No match found for question ID: $questionID with user answer: $userAnswer");
        return 0;
    }

    public function finalize_score($instance, $logs)
    {
        $totalScore = 0;
        foreach ($logs as $log) {
            trace("Processing log: " . print_r($log, true));
            $totalScore += $this->check_answer($log);
        }
        trace("Total score after finalizing: $totalScore");
        return $totalScore;
    }

    protected function load_questions($timestamp = false)
    {
        trace("Checking Question count: $this->total_questions ");
        if (empty($this->inst->qset->data)) {
            $this->inst->get_qset($this->inst->id, $timestamp);
        }

        if (!empty($this->inst->qset->data)) {
            $this->questions = Widget_Instance::find_questions($this->inst->qset->data);
            trace("Questions loaded: " . print_r($this->questions, true));
        }
    }
}
