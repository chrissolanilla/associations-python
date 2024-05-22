<?php
namespace Materia;

class Score_Modules_PyramidWidget extends Score_Module
{
	public function check_answer($log)
	{
		return false;
		if (isset($this->questions[$log->item_id]))
		{
			$question = $this->questions[$log->item_id];
			foreach ($question->answers as $answer)
			{
				if ($log->text == $answer['text'])
				{
					return $answer['value'];
					break;
				}
			}
		}
	}
}
