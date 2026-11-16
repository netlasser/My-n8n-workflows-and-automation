const flowConfig = {
  "id": "1b2f6bbf-0c8d-466f-8906-1845e3b5f5a0",
  "name": "My First Flow",
  "edges": [
    {
      "id": "triggerNode_1-apiNode_485",
      "type": "defaultEdge",
      "source": "triggerNode_1",
      "target": "apiNode_485",
      "sourceHandle": "bottom",
      "targetHandle": "top"
    },
    {
      "id": "apiNode_485-LLMNode_985",
      "type": "defaultEdge",
      "source": "apiNode_485",
      "target": "LLMNode_985",
      "sourceHandle": "bottom",
      "targetHandle": "top"
    },
    {
      "id": "codeNode_706-forLoopNode_555",
      "type": "defaultEdge",
      "source": "codeNode_706",
      "target": "forLoopNode_555",
      "sourceHandle": "bottom",
      "targetHandle": "top"
    },
    {
      "id": "forLoopNode_555-LLMNode_522",
      "data": {
        "condition": "Loop Start",
        "invisible": true
      },
      "type": "conditionEdge",
      "source": "forLoopNode_555",
      "target": "LLMNode_522",
      "sourceHandle": "bottom",
      "targetHandle": "top"
    },
    {
      "id": "forLoopNode_555-forLoopEndNode_724",
      "data": {
        "condition": "Loop",
        "invisible": false
      },
      "type": "loopEdge",
      "source": "forLoopNode_555",
      "target": "forLoopEndNode_724",
      "sourceHandle": "bottom",
      "targetHandle": "top"
    },
    {
      "id": "LLMNode_522-forLoopEndNode_724",
      "type": "defaultEdge",
      "source": "LLMNode_522",
      "target": "forLoopEndNode_724",
      "sourceHandle": "bottom",
      "targetHandle": "top"
    },
    {
      "id": "forLoopEndNode_724-forLoopNode_555",
      "data": {
        "condition": "Loop",
        "invisible": true
      },
      "type": "loopEdge",
      "source": "forLoopEndNode_724",
      "target": "forLoopNode_555",
      "sourceHandle": "bottom",
      "targetHandle": "top"
    },
    {
      "id": "LLMNode_985-codeNode_706",
      "type": "defaultEdge",
      "source": "LLMNode_985",
      "target": "codeNode_706",
      "sourceHandle": "bottom",
      "targetHandle": "top"
    },
    {
      "id": "forLoopEndNode_724-graphqlResponseNode_676",
      "type": "defaultEdge",
      "source": "forLoopEndNode_724",
      "target": "graphqlResponseNode_676",
      "sourceHandle": "bottom",
      "targetHandle": "top"
    },
    {
      "id": "response-graphqlResponseNode_676",
      "type": "responseEdge",
      "source": "triggerNode_1",
      "target": "graphqlResponseNode_676",
      "sourceHandle": "to-response",
      "targetHandle": "from-trigger"
    }
  ],
  "status": "active",
  "created_at": "2026-11-16T06:52:05.089391+00:00",
  "trigger_id": null,
  "nodes": [
    {
      "id": "triggerNode_1",
      "data": {
        "nodeId": "graphqlNode",
        "values": {
          "nodeName": "API Request",
          "responeType": "realtime",
          "advance_schema": "{\n  \"execute\": \"bool\"\n}"
        },
        "trigger": true
      },
      "type": "triggerNode",
      "position": {
        "x": 0,
        "y": 0
      }
    },
    {
      "id": "apiNode_485",
      "data": {
        "nodeId": "apiNode",
        "values": {
          "url": "https://dhruvlamatic.app.n8n.cloud/webhook/8cfe684a-6b95-495f-b29d-afb7a2c012e2",
          "body": "",
          "method": "GET",
          "headers": "",
          "retries": "0",
          "nodeName": "API",
          "retry_deplay": "0"
        }
      },
      "type": "dynamicNode",
      "position": {
        "x": 0,
        "y": 0
      }
    },
    {
      "id": "LLMNode_985",
      "data": {
        "nodeId": "LLMNode",
        "values": {
          "tools": [],
          "prompts": [
            {
              "id": "187c2f4b-c23d-4545-abef-73dc897d6b7b",
              "role": "system",
              "content": "You will receive a newsletter text containing multiple sections. Your task is to extract all entries from all sections and format the output as an array. Each element in the array should be a JSON object with two keys:\n\n\"title\": The complete article title\n\n\"summary\": The full article summary text\n\nRequirements:\n\nInclude all articles from all sections\n\nPreserve exact original wording\n\nReturn only the array\n\nProperly escape quotes and special characters\n\nDo not add markdown, code blocks, or a JSON wrapper\n\nEXPECTED STRUCTURE:\n\n'\\[\n\n {\n\n \"title\": \"Hugging Face Replicating OpenAI's Deep Research\",\n\n \"summary\": \"Hugging Face attempted to replicate OpenAI's Deep Research, an agentic web\\-search framework that significantly improved performance on the GAIA benchmark, by running a 24\\-hour\\-long experiment aimed at open\\-sourcing an equivalent system.\"\n\n },\n\n {\n\n \"title\": \"Google CEO on DeepSeek vs. Gemini\",\n\n \"summary\": \"Sundar Pichai has downplayed the efficiency of DeepSeek's AI models, arguing that Google's Gemini models, particularly Gemini 2.0 Flash, outperform them despite DeepSeek's disruptive impact on the AI market.\"\n\n },\n\n {\n\n \"title\": \"US Copyright Office rules out copyright for AI created content without human input\",\n\n \"summary\": \"The US Copyright Office states that AI\\-generated works without human intervention cannot be copyrighted. AI tools assisting with creativity, like de\\-aging actors, won't limit copyright protection, but purely generative AI outputs require further analysis.\"\n\n },\n\n {\n\n \"title\": \"Harmonic Loss Trains Interpretable AI Models\",\n\n \"summary\": \"Harmonic loss is an alternative to cross\\-entropy loss for training neural networks that offers better interpretability and faster convergence through scale invariance and finite convergence points. Experiments across algorithmic, vision, and language datasets, demonstrate that models trained with harmonic loss show superior performance in interpretability, data efficiency, and reduced grokking compared to standard models. Harmonic loss could be particularly valuable for applications with limited data or where interpretability is crucial.\"\n\n },\n\n\\]'\n\ninput: {{apiNode_531.output}}"
            }
          ],
          "memories": "[]",
          "messages": "[]",
          "nodeName": "Generate Text",
          "generativeModelName": {}
        }
      },
      "type": "dynamicNode",
      "position": {
        "x": 0,
        "y": 0
      }
    },
    {
      "id": "forLoopNode_555",
      "data": {
        "nodeId": "forLoopNode",
        "values": {
          "wait": 0,
          "endValue": "10",
          "nodeName": "Loop",
          "increment": "1",
          "connectedTo": "forLoopEndNode_724",
          "iterateOver": "list",
          "initialValue": "0",
          "iteratorValue": "{{codeNode_706.output}}"
        }
      },
      "type": "forLoopNode",
      "position": {
        "x": 0,
        "y": 0
      }
    },
    {
      "id": "forLoopEndNode_724",
      "data": {
        "nodeId": "forLoopEndNode",
        "values": {
          "nodeName": "Loop End",
          "connectedTo": "forLoopNode_555"
        }
      },
      "type": "forLoopEndNode",
      "position": {
        "x": 0,
        "y": 0
      }
    },
    {
      "id": "LLMNode_522",
      "data": {
        "nodeId": "LLMNode",
        "values": {
          "tools": [],
          "prompts": [
            {
              "id": "187c2f4b-c23d-4545-abef-73dc897d6b7b",
              "role": "system",
              "content": "You will act as an experienced LinkedIn Social Media Expert and AI entrepreneur who brings the best GenAI Techniques, Insights & Research to there followers. You will write engaging LinkedIn post that provides value or insights on a topic. Write the post in English, without including the system message.\n\n\\- You approach serious topics related to SAAS, and AI development in a professional way to make them more accessible to the general public.\n\n\\- In formatting your texts, you use bullet points to organize your ideas and facilitate reading. Use either of these \\#1\\. , ☑, ↳, → or relevant emoji as bullet style.\n\n\\- You try to distill powerful ai capabilities into elegant simplicity so that an any business can apply that.\n\n\\- You also use short and simple sentences to convey your message clearly and concisely.\n\n\\- Overall, your tone is optimistic and encouraging, with a touch of humor but keep it personal in first person.\n\n\\- Use a conclusion at the end of your text to engage your audience and elicit their reaction. You consistently encourage interaction by inviting your audience to comment and share this with there peers using one of these ♻️♺🔁 or sometimes asking them to follow for more content like this'\n\n\\- Keep the points really short and whole post readable within 3 mins.\n\n\\- Always start with a personal tone that is short hook in the audience in first 2 lines and encourages users to keep reading\n\n\\- Now, I would like you to write a LinkedIn post in my style on after thorough articulation of following topic:\n\n\\-\\-\\-\n\n{{forLoopNode_927.output.currentValue}}"
            }
          ],
          "memories": "[]",
          "messages": "[]",
          "nodeName": "Generate Text",
          "generativeModelName": {}
        }
      },
      "type": "dynamicNode",
      "position": {
        "x": 0,
        "y": 0
      }
    },
    {
      "id": "codeNode_706",
      "data": {
        "nodeId": "codeNode",
        "values": {
          "code": "output = JSON.parse({{LLMNode_985.output.generatedResponse}})",
          "nodeName": "Code"
        }
      },
      "type": "dynamicNode",
      "position": {
        "x": 0,
        "y": 0
      }
    },
    {
      "id": "graphqlResponseNode_676",
      "data": {
        "nodeId": "graphqlResponseNode",
        "values": {
          "nodeName": "API Response",
          "outputMapping": "{\n  \"posts\": \"{{forLoopEndNode_724.output.loopOutput}}\"\n}"
        }
      },
      "type": "dynamicNode",
      "position": {
        "x": 0,
        "y": 0
      }
    }
  ]
};

export async function getNodesAndEdges(): Promise<{
    nodes: Record<string, any>[],
    edges: Record<string, any>[],
}> {
    return {
        nodes: flowConfig.nodes,
        edges: flowConfig.edges,
    }
}

export async function getFlowConfig(): Promise<Record<string, any>> {
    return flowConfig;
}