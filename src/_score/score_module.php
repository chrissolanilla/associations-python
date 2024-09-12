<?php
namespace Materia;

class Score_Modules_Connections extends Score_Module
{
	private $lives = 0;//how do get it from the qset?
	private $applyPenalty = false;


	public function handle_log_question_answered($log) {
		//dont incremenet lives here, do it in check answer
		$this->verified_score += $this->check_answer($log);
	}

	public function calculate_score() {
		if($this->lives <=0) {
			$this->applyPenalty = true;
			trace("Lives are zero, penalty applied");
		}
		$global_mod = array_sum($this->global_modifiers);
		//if is right OR if wrong AND lives <=0
		if ($this->total_questions > 0)
		{
			$points = $this->verified_score + $global_mod * $this->total_questions;
			$this->calculated_percent = $points / $this->total_questions;
		}
		else
		{
			$points = $this->verified_score + $global_mod;
			$this->calculated_percent = $points;
		}
		if ($this->calculated_percent < 0) $this->calculated_percent = 0;
		if ($this->calculated_percent > 100) $this->calculated_percent = 100;
	}

	public function check_answer($log){
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
			$question =
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
				$this->total_questions++;
				trace("our total questions is now: $this->total_questions");
				return 100;
			}

			else if($this->lives > 0) {
				$this->lives--;
				$seen_wrong_answers[$questionID] = $userAnswer;
				return 0;
			}
			else if($this->lives <= 0) {
				$this->total_questions++;
				trace("Lives are 0 or less, our total questions is now: $this->total_questions");
				return 0;
			}
		}
		else {
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

	//initialize the lives
	if(isset($this->inst->qset->data['lives'])) {
		$this->lives = $this->inst->qset->data['lives'];
		trace("Lives loaded: $this->lives");
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

