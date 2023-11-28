import json
from dataclasses import asdict, dataclass
from typing import List

@dataclass
class Sentence:
    text: str
    start_time: float

@dataclass
class Transcript:
    sentences: List[Sentence]

    def to_dict(self) -> dict:
        return {"sentences": [asdict(sentence) for sentence in self.sentences]}

    def to_json(self, *args, **kwargs) -> str:
        return json.dumps(self.to_dict(), ensure_ascii=False, *args, **kwargs)

    @classmethod
    def from_json(cls, json_string: str) -> "Transcript":
        data = json.loads(json_string)
        return cls(sentences=[Sentence(**sentence) for sentence in data["sentences"]])
