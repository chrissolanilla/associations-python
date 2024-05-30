<?php
namespace Materia;

class Score_Modules_Connections extends Score_Module
{
    public function check_answer($log)
    {
        $questionID = $log->item_id;
        $userAnswer = $log->text;
        trace($userAnswer); //example text log is : 'Dragons,Unicorns,Fairies,Mermaids'
        trace("The question ID is : $questionID and user answer is: $userAnswer");
        trace("newchris");
        trace("Available question IDs: " . implode(',', array_keys($this->questions)));

        // Check if question exists
        if (isset($this->questions[$questionID])) {
            $question = $this->questions[$questionID];
            $userAnswerArray = explode(',', $userAnswer);
            // Makes it so the order does not matter when checking the descriptions
            sort($userAnswerArray);

            $correctAnswerArray = array_map(function ($a) {
                return $a['text'];
            }, $question->answers);
            sort($correctAnswerArray);

            trace("The correct array answer is " . implode(',', $correctAnswerArray));
            trace(implode(',', $userAnswerArray));
            if ($userAnswerArray == $correctAnswerArray) {
                trace("Match found successfully for question ID: $questionID with value: {$question->answers[0]['value']}");
                return $question->answers[0]['value'];
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
