<?php
namespace Materia;

class Score_Modules_Connections extends Score_Module
{
  public function check_answer($log)
  {
    $questionID = $log->item_id;
    $userAnswer = json_decode($log->text, true); // Decode JSON string to array
    $seenAnswers = []; // Use an array to track seen questions
    $isCorrect = false;

    // Log the user answer array
    trace($userAnswer);
    trace("The question ID is: $questionID and user answer is: " . implode(', ', $userAnswer));
    trace("newchris");
    trace("Available question IDs: " . implode(',', array_keys($this->questions)));

    // Check if question exists
    if (isset($this->questions[$questionID])) {
      trace("Question has been found");
      trace("Checking if we have seen this question before");

      // Exit if question has been seen
      if (in_array($questionID, $seenAnswers)) {
        trace("We have seen this question before");
        return;
      }

      trace("Adding it to the seen answers array");
      // Add question ID to seen list
      $seenAnswers[] = $questionID;

      $question = $this->questions[$questionID];
      // Ensure userAnswer is treated as an array
      $userAnswerArray = array_map('trim', $userAnswer);

      foreach ($question->answers as $answer) {
        $correctAnswerArray = array_map('trim', $answer['text']); // Use the correct answer text as an array and trim whitespace
        if ($this->contains_all($correctAnswerArray, $userAnswerArray)) {
          // Exit after finding a correct answer
          trace("Match found successfully for question ID: $questionID");
          $isCorrect = true;
          break;
        }
      }

      if ($isCorrect) {
        return 100;
      } else {
        $seen_wrong_answers[$questionID] = $userAnswer;
        return 0;
      }
    } else {
      trace("SORRY Question ID: $questionID not found in questions array");
      trace("Why are we here, just to suffer...");
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
?>

