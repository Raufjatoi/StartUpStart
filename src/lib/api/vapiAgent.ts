import Vapi from '@vapi-ai/web';

const vapiClient = new Vapi({
  apiKey: import.meta.env.VITE_VAPI_API_KEY,
});

export async function startVoiceChat() {
  try {
    console.log('Initializing VAPI call...');
    const call = await vapiClient.call.create({
      assistant_id: import.meta.env.VITE_VAPI_ASSISTANT_ID,
      allow_speech_creation: true,
      user: {
        name: "User",
      },
      workflow: {
        id: "startupstart",
      },
      audio: {
        synthesizer: {
          voice: "nova", // You can try different voices: "nova", "shimmer", "echo", "alloy", "fable"
        }
      }
    });

    console.log('VAPI call initialized:', call);
    return call;
  } catch (error) {
    console.error('VAPI call initialization error:', error);
    throw error;
  }
}

export function setupCallHandlers(call: any) {
  call.on('transcript', (transcript: any) => {
    console.log('User said:', transcript.text);
  });

  call.on('error', (error: any) => {
    console.error('Call error:', error);
  });

  call.on('assistant-response', (response: any) => {
    console.log('Assistant response:', response.text);
  });

  call.on('ended', () => {
    console.log('Call ended');
  });

  return call;
}





