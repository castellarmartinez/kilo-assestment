import { useState } from "react";

import TabButton from "./TabButton";
import { EXAMPLES } from "../data-with-examples";
import Section from "./Section";

export default function Examples() {
  function handleClick(selectedButton) {
    setSelectedTopic(selectedButton);
    console.log(selectedTopic);
  }

  const [selectedTopic, setSelectedTopic] = useState();

  let contentTopic = <p>Please select a topic</p>;

  if (selectedTopic) {
    contentTopic = (
      <div>
        <h3>{EXAMPLES[selectedTopic].title}</h3>
        <p>{EXAMPLES[selectedTopic].description}</p>
        <pre>
          <code>{EXAMPLES[selectedTopic].code}</code>
        </pre>
      </div>
    );
  }

  return (
    <Section title={"Examples"} id="examples">
      <menu>
        {["components", "jsx", "props", "state"].map((topic) => (
          <TabButton
            key={topic}
            onClick={() => handleClick(topic)}
            isSelected={selectedTopic === topic}
          >
            {topic}
          </TabButton>
        ))}
      </menu>
      <div id="tab-content">{contentTopic}</div>
    </Section>
  );
}
