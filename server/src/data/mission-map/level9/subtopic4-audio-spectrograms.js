const { CHALLENGE_TYPES, CHALLENGE_DIFFICULTY } = require('../../../constants/challengeTypes');

const subtopic4Questions = [
  {
    stableId: 'HTG-L09-OE31',
    order: 31,
    levelNumber: 9,
    title: 'Short-Time Fourier Transform (STFT) Spectrogram Generation',
    prompt: `To visually inspect audio recordings for hidden text, watermarks, or frequency-domain glyphs, forensic analysts render a spectrogram that maps frequency magnitude over elapsed time.

Spectrogram generation partitions the continuous audio waveform into short overlapping time frames and computes the Fourier transform for each windowed segment.

What 4-letter uppercase acronym designates the Short-Time Fourier Transform that underpins this time-frequency analysis?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-letter acronym).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{STFT}',
    hints: [
      {
        hintIndex: 1,
        content: "Short-Time Fourier Transform is abbreviated STFT.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE31',
      seedId: 'HTG-L09-OE31',
      subtopic: 'Audio steganography & spectrogram analysis',
      explanation: "STFT computes discrete Fourier transforms over sliding windowed segments to construct spectrograms.",
      essentialKeyPoints: [
        "Tools like Sonic Visualiser and Audacity compute STFT to display spectrogram images.",
        "Adversaries paint text or symbols into high-frequency audio bins that appear only when viewed in a spectrogram."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{STFT}' or 'STFT'.",
        partialCredit: "Submits lowercase 'stft'.",
        noCredit: "Submits FFT or DFT."
      },
      acceptableAlternatives: ['HTG{STFT}', 'STFT', 'stft', 'HTG{stft}']
    }
  },
  {
    stableId: 'HTG-L09-OE32',
    order: 32,
    levelNumber: 9,
    title: 'Human Hearing Ultrasonic Frequency Threshold',
    prompt: `The nominal range of human hearing spans from 20 Hz to approximately 20,000 Hz (20 kHz). While higher frequencies are inaudible to adult humans, modern audio recording equipment and digital DAC/ADC converters sampling at 44.1 kHz or 96 kHz readily capture them.

In ultrasonic audio steganography, covert signaling and acoustic beacons are embedded at or above what frequency threshold (in kilohertz, kHz)?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the integer threshold in kHz).`,
    type: 'Numeric Answer',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{20}',
    hints: [
      {
        hintIndex: 1,
        content: "20 kHz (20,000 Hz) is the standard upper limit of human hearing.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE32',
      seedId: 'HTG-L09-OE32',
      subtopic: 'Audio steganography & spectrogram analysis',
      explanation: "Frequencies above 20 kHz are considered ultrasonic and inaudible to human ears while recordable by digital hardware.",
      essentialKeyPoints: [
        "In a 44.1 kHz sampled audio track, the Nyquist limit is 22.05 kHz, leaving a 2 kHz inaudible band (20–22 kHz).",
        "Ultrasonic tracking beacons exploit this inaudible upper spectrum."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{20}' or '20'.",
        partialCredit: "Submits '20 kHz' or '20000'.",
        noCredit: "Submits 10 or 44."
      },
      acceptableAlternatives: ['HTG{20}', '20', '20 kHz', '20kHz', '20000', 'HTG{20kHz}']
    }
  },
  {
    stableId: 'HTG-L09-OE33',
    order: 33,
    levelNumber: 9,
    title: 'Dual-Tone Multi-Frequency (DTMF) Signaling System',
    prompt: `In telecommunication and legacy audio signaling, numeric dialing keys (0-9, *, #) and routing commands are encoded as combinations of two simultaneous sinusoidal pure audio tones (one from a low frequency group and one from a high frequency group).

What 4-letter uppercase acronym designates this Dual-Tone Multi-Frequency signaling system?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-letter acronym).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{DTMF}',
    hints: [
      {
        hintIndex: 1,
        content: "Dual-Tone Multi-Frequency is abbreviated DTMF.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE33',
      seedId: 'HTG-L09-OE33',
      subtopic: 'Audio steganography & spectrogram analysis',
      explanation: "DTMF generates paired tones to transmit digits over audio telephone lines.",
      essentialKeyPoints: [
        "DTMF frequencies (e.g. 697, 770, 852, 941 Hz and 1209, 1336, 1477, 1633 Hz) are easily identified in spectrograms.",
        "Steganographers use DTMF bursts embedded in background noise to pass telephone numbers or PINs."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{DTMF}' or 'DTMF'.",
        partialCredit: "Submits lowercase 'dtmf'.",
        noCredit: "Submits FSK or PSK."
      },
      acceptableAlternatives: ['HTG{DTMF}', 'DTMF', 'dtmf', 'HTG{dtmf}']
    }
  },
  {
    stableId: 'HTG-L09-OE34',
    order: 34,
    levelNumber: 9,
    title: 'Echo Hiding Detection via Cepstral Analysis',
    prompt: `In audio echo hiding, secret binary data is embedded by adding short, artificial echoes with distinct delay intervals (e.g., $d_0 = 1.0$ ms for bit 0, $d_1 = 1.5$ ms for bit 1). Because the delays are under the human auditory echo perception threshold, the ear perceives them as natural resonance.

To detect and recover these periodic echo delays, steganalysts compute the Fourier transform of the logarithm of the power spectrum:
$$C(q) = \\mathcal{F}^{-1}\\left\\{ \\log |\\mathcal{F}\\{x(t)\\}|^2 \\right\\}$$
What is the mathematical term (an anagram of the word "spectrum") for this transform domain?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the transform name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{Cepstrum}',
    hints: [
      {
        hintIndex: 1,
        content: "Rearranging the letters of 'spectrum' produces 'cepstrum'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE34',
      seedId: 'HTG-L09-OE34',
      subtopic: 'Audio steganography & spectrogram analysis',
      explanation: "The cepstrum isolates periodic harmonics and echo delays as distinct peaks on the quefrency axis.",
      essentialKeyPoints: [
        "Echo hiding is readily detected in the cepstral domain.",
        "Cepstral peaks disclose the exact delay parameter used to encode bits."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Cepstrum}' or 'Cepstrum'.",
        partialCredit: "Submits 'cepstral' or 'cepstrum analysis'.",
        noCredit: "Submits spectrum or spectrogram."
      },
      acceptableAlternatives: ['HTG{Cepstrum}', 'Cepstrum', 'cepstrum', 'cepstral analysis', 'Cepstral Analysis', 'HTG{cepstrum}']
    }
  },
  {
    stableId: 'HTG-L09-OE35',
    order: 35,
    levelNumber: 9,
    title: 'WAV RIFF Audio Sample Data Chunk Identifier',
    prompt: `In Microsoft Resource Interchange File Format (RIFF) WAV files, the binary stream is organized into FourCC (four-character code) chunks, including the \`RIFF\` container chunk and the \`fmt \` format specification chunk.

Which 4-character lowercase chunk identifier marks the beginning of the raw uncompressed PCM audio sample bytes?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 4-character chunk name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{data}',
    hints: [
      {
        hintIndex: 1,
        content: "The raw samples chunk in a WAV file is named 'data'.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE35',
      seedId: 'HTG-L09-OE35',
      subtopic: 'Audio steganography & spectrogram analysis',
      explanation: "The 'data' chunk contains the raw PCM audio samples in a standard RIFF WAV file.",
      essentialKeyPoints: [
        "WAV files contain 'RIFF', 'fmt ', and 'data' chunks.",
        "Audio LSB steganography modifies bytes inside the 'data' payload."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{data}' or 'data'.",
        partialCredit: "Submits uppercase 'DATA'.",
        noCredit: "Submits RIFF or WAVE."
      },
      acceptableAlternatives: ['HTG{data}', 'data', 'DATA', 'HTG{DATA}']
    }
  },
  {
    stableId: 'HTG-L09-OE36',
    order: 36,
    levelNumber: 9,
    title: 'Audio Phase Coding Steganography Technique',
    prompt: `Psychoacoustic research demonstrates that the human auditory system is exceptionally sensitive to spectral magnitude changes, but largely insensitive to absolute phase shifts, provided the relative phase differences between adjacent frequency components remain smooth.

What steganographic technique takes advantage of this property by substituting the initial phase angle of an audio segment with a secret phase sequence?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the technique name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{Phase Coding}',
    hints: [
      {
        hintIndex: 1,
        content: "The method is known as phase coding (or phase modulation steganography).",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE36',
      seedId: 'HTG-L09-OE36',
      subtopic: 'Audio steganography & spectrogram analysis',
      explanation: "Phase coding alters phase angles in the first audio frame while adjusting subsequent frames to prevent audible phase jumps.",
      essentialKeyPoints: [
        "Absolute phase changes are inaudible to human listeners.",
        "Phase coding provides high inaudibility but low payload capacity compared to LSB substitution."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Phase Coding}' or 'Phase Coding'.",
        partialCredit: "Submits 'phase coding' or 'phase modulation'.",
        noCredit: "Submits echo hiding or spread spectrum."
      },
      acceptableAlternatives: ['HTG{Phase Coding}', 'Phase Coding', 'phase coding', 'phase modulation', 'Phase Modulation', 'HTG{phase coding}']
    }
  },
  {
    stableId: 'HTG-L09-OE37',
    order: 37,
    levelNumber: 9,
    title: 'MP3 Bit Reservoir Auxiliary Payload Pool',
    prompt: `In the MPEG-1 Audio Layer III (MP3) standard, frames with low acoustic complexity do not consume their full allocated bit budget.

Unused bits from these simple frames are accumulated into an elastic pool that can be borrowed by subsequent frames containing complex transients.

What 2-word phrase designates this dynamic bit pool (known as the "... reservoir"), which can be co-opted by steganographers to store auxiliary covert payloads?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the 2-word phrase).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{bit reservoir}',
    hints: [
      {
        hintIndex: 1,
        content: "The MP3 mechanism is the bit reservoir.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE37',
      seedId: 'HTG-L09-OE37',
      subtopic: 'Audio steganography & spectrogram analysis',
      explanation: "The MP3 bit reservoir allows frames to borrow and store surplus bits across frame boundaries.",
      essentialKeyPoints: [
        "The bit reservoir can hold up to 511 bytes of auxiliary data.",
        "Manipulating bit reservoir pointers embeds hidden payload bytes without altering psychoacoustic psycho-tables."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{bit reservoir}' or 'bit reservoir'.",
        partialCredit: "Submits capitalized 'Bit Reservoir'.",
        noCredit: "Submits buffer or cache."
      },
      acceptableAlternatives: ['HTG{bit reservoir}', 'bit reservoir', 'Bit Reservoir', 'bit-reservoir', 'HTG{Bit Reservoir}']
    }
  },
  {
    stableId: 'HTG-L09-OE38',
    order: 38,
    levelNumber: 9,
    title: 'Phase Inversion Cancellation Phenomenon',
    prompt: `In differential audio forensic analysis, an investigator is given a stego audio track and the original clean master track.

By inverting the phase of the clean reference track by 180 degrees ($\pi$ radians) and mixing it in equal parts with the stego track, all identical musical elements sum to zero and are completely muted.

What physical wave interference phenomenon causes identical waveforms to cancel each other out when phase-inverted?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the term).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{phase cancellation}',
    hints: [
      {
        hintIndex: 1,
        content: "Inverting phase causes destructive interference or phase cancellation.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE38',
      seedId: 'HTG-L09-OE38',
      subtopic: 'Audio steganography & spectrogram analysis',
      explanation: "Phase cancellation (destructive interference) cancels identical audio signals when summed with 180-degree phase difference.",
      essentialKeyPoints: [
        "Subtracting the cover audio from the stego audio isolates the embedded secret signal directly.",
        "Audio software like Audacity implements this via 'Invert' followed by 'Mix and Render'."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{phase cancellation}' or 'phase cancellation'.",
        partialCredit: "Submits 'destructive interference' or 'phase inversion'.",
        noCredit: "Submits resonance or amplification."
      },
      acceptableAlternatives: ['HTG{phase cancellation}', 'phase cancellation', 'Phase Cancellation', 'destructive interference', 'Destructive Interference', 'HTG{destructive interference}']
    }
  },
  {
    stableId: 'HTG-L09-OE39',
    order: 39,
    levelNumber: 9,
    title: 'Telegraphic Dot-Dash Morse Audio Signaling Code',
    prompt: `A short audio capture recovered from a surveillance wiretap features a steady 800 Hz sinusoidal carrier tone that is pulsed into sequences of short beeps (dits) and long beeps (dahs):
\`\`\`text
.-. .- -.. .. ---
\`\`\`
Which historical telegraphic signaling code (named after Samuel Morse) is used to translate these rhythmic tone durations into alphanumeric text?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the code name).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{Morse}',
    hints: [
      {
        hintIndex: 1,
        content: "Named after Samuel Morse: Morse code.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE39',
      seedId: 'HTG-L09-OE39',
      subtopic: 'Audio steganography & spectrogram analysis',
      explanation: "Morse code encodes characters using standardized sequences of short and long signals (dots and dashes).",
      essentialKeyPoints: [
        "Audio carriers pulsing at fixed pitch frequencies are easily decoded as Morse code.",
        ".-. .- -.. .. --- decodes to 'RADIO'."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{Morse}' or 'Morse'.",
        partialCredit: "Submits 'Morse code' or 'morse'.",
        noCredit: "Submits Baudot or ASCII."
      },
      acceptableAlternatives: ['HTG{Morse}', 'Morse', 'morse', 'Morse code', 'Morse Code', 'HTG{morse}']
    }
  },
  {
    stableId: 'HTG-L09-OE40',
    order: 40,
    levelNumber: 9,
    title: 'Spectrogram Visual Audio Watermark Text Extraction',
    prompt: `An audio forensic investigator loads a suspect 44.1 kHz WAV recording into a spectral analysis tool and configures a 2048-point Blackman-Harris window with logarithmic frequency scaling.

Between seconds 4.0 and 8.0 in the 14 kHz–18 kHz frequency band, clear alphanumeric characters appear painted directly into the acoustic energy spectrum:
\`\`\`text
+-----------------------------------------------------------+
| 18 kHz                                                    |
|         B E A C O N _ A L P H A _ 9 9                     |
| 14 kHz                                                    |
+-----------------------------------------------------------+
  4.0s                                              8.0s
\`\`\`
What exact beacon text string is inscribed into this audio spectrogram?

Format your answer as a standard competition flag: prefix HTG with curly braces enclosing the value (or submit the exact string).`,
    type: 'Short Text',
    options: [],
    points: 100,
    attempts: 5,
    required: true,
    status: 'Published',
    isActive: true,
    isCaseSensitive: false,
    category: 'Network',
    difficulty: 'EXPERT',
    flag: 'HTG{BEACON_ALPHA_99}',
    hints: [
      {
        hintIndex: 1,
        content: "Transcribe the text visible in the spectrogram: BEACON_ALPHA_99.",
        penaltyPoints: 10
      }
    ],
    metadata: {
      stableId: 'HTG-L09-OE40',
      seedId: 'HTG-L09-OE40',
      subtopic: 'Audio steganography & spectrogram analysis',
      explanation: "The spectrogram visually displays the text 'BEACON_ALPHA_99' across high-frequency bins.",
      essentialKeyPoints: [
        "Audio stego software (e.g., Coagula, Paint2Sound) synthesizes audio whose STFT renders visual glyphs.",
        "Visual spectrogram inspection is a mandatory check in multimedia forensic triage."
      ],
      gradingRubric: {
        fullCredit: "Submits 'HTG{BEACON_ALPHA_99}' or 'BEACON_ALPHA_99'.",
        partialCredit: "Submits lowercase 'beacon_alpha_99'.",
        noCredit: "Submits partial text."
      },
      acceptableAlternatives: ['HTG{BEACON_ALPHA_99}', 'BEACON_ALPHA_99', 'beacon_alpha_99', 'HTG{beacon_alpha_99}']
    }
  }
];

module.exports = subtopic4Questions;

