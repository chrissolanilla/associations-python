<?php
namespace Materia;

class Score_Modules_Connections extends Score_Module
{
  public function check_answer($log)
  {
    $questionID = $log->item_id;
    $userAnswer = $log->text;
    $seenAnswers = []; // Use an array to track seen questions
    $isCorrect = false;

    // trace("Seen answers array: $seenAnswers");
    trace($userAnswer); // Example text log is : 'Dragons,Unicorns,Fairies,Mermaids'
    trace("The question ID is : $questionID and user answer is: $userAnswer");
    trace("newchris");
    trace("Available question IDs: " . implode(',', array_keys($this->questions)));

    // Check if question exists
    if (isset($this->questions[$questionID])) {
      trace("question has been found");
      trace("checking if we have seen this question before");
        // Exit if question has been seen
      if (in_array($questionID, $seenAnswers)) {
        trace("we have seen this question before");
        return;
      }
      trace("adding it to the seen answers array");
        // Add question ID to seen list
      $seenAnswers[] = $questionID;

      $question = $this->questions[$questionID];
        // Trim whitespace
      $userAnswerArray = array_map('trim', explode(',', $userAnswer));

      foreach ($question->answers as $answer) {
        $correctAnswerArray = array_map('trim', explode(',', $answer['text'])); // convert correct answer text to array and trim whitespace
        if ($this->contains_all($correctAnswerArray, $userAnswerArray)) {
            // exit  after finding a correct answer
          trace("Match found successfully for question ID: $questionID");
          $isCorrect = true;
          break;
        }
      }

      if ($isCorrect) {
        return 100;
      } else {
        $seen_wrong_answers[$questionID] = $userAnswer;
        // trace("never seen this wrong answer before");
        return 0;
      }
    } else {
      trace("SORRY Question ID: $questionID not found in questions array");
      trace("why are we here, just to suffer...");
    }
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

  private function contains_all($correctAnswerArray, $userAnswerArray)
  {
    foreach ($correctAnswerArray as $answer) {
      if (!in_array($answer, $userAnswerArray)) {
        return false;
      }
    }
    return true;
  }
}
