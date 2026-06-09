const MIN_CHUNK_SIZE = 4096; // 256ms of audio at 16kHz

class PCMEncoder extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Float32Array(MIN_CHUNK_SIZE);
    this.bufferFrames = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const channelData = input[0];
    
    // Copy channel data into our buffer
    for (let i = 0; i < channelData.length; i++) {
        if (this.bufferFrames >= MIN_CHUNK_SIZE) {
            // Buffer is full, flush it
            this.flush();
        }
        this.buffer[this.bufferFrames++] = channelData[i];
    }
    
    return true;
  }
  
  flush() {
    if (this.bufferFrames === 0) return;
    
    const pcm16 = new Int16Array(this.bufferFrames);
    for (let i = 0; i < this.bufferFrames; i++) {
      let s = Math.max(-1, Math.min(1, this.buffer[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    this.port.postMessage(pcm16.buffer, [pcm16.buffer]);
    this.bufferFrames = 0;
  }
}

registerProcessor("pcm-encoder", PCMEncoder);
