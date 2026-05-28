export const wavesSoundLight = {
  id: 'waves-sound-light',
  title: 'Waves, Sound & Light',
  description: 'Understand wave properties, sound propagation, and light behavior',
  grade: 10,
  term: 1,
  subject: 'physics',

  conceptExplanation: {
    title: 'Waves, Sound & Light',
    content: `
      <h3>What Is a Wave?</h3>
      <p>A wave is a disturbance that travels through a medium, transferring energy from one place to another WITHOUT transferring matter.</p>
      <p><strong>Key insight:</strong> Waves carry energy, but the medium itself doesn't move along with the wave.</p>

      <h3>Types of Waves</h3>
      <p><strong>Transverse Waves:</strong> The disturbance is perpendicular to the direction of wave travel</p>
      <p><strong>Example:</strong> Water waves, light waves, vibrating strings</p>
      <p>Imagine flicking a rope up and down — the rope moves up/down, but the wave moves along the rope.</p>

      <p><strong>Longitudinal Waves:</strong> The disturbance is parallel to the direction of wave travel</p>
      <p><strong>Example:</strong> Sound waves, compression waves in a spring</p>
      <p>Imagine pushing a spring forward and backward — the coils compress/stretch along the direction of motion.</p>

      <h3>Wave Properties</h3>
      <p><strong>Wavelength (λ):</strong> Distance from one peak to the next peak (or trough to trough). Measured in meters (m).</p>
      <p><strong>Frequency (f):</strong> Number of complete waves passing a point per second. Measured in Hertz (Hz).</p>
      <p><strong>Amplitude (A):</strong> Maximum displacement of a particle from its rest position. Measured in meters.</p>
      <p><strong>Wave Speed (v):</strong> How fast the wave travels through the medium.</p>

      <h3>Wave Equation</h3>
      <p><strong>v = f × λ</strong></p>
      <p>Wave speed = frequency × wavelength</p>
      <p>This is THE fundamental relationship — it applies to ALL waves!</p>

      <h3>Wave Behavior</h3>
      <p><strong>Reflection:</strong> Wave bounces off a surface (like echo)</p>
      <p><strong>Refraction:</strong> Wave bends when passing from one medium to another (like light in water)</p>
      <p><strong>Interference:</strong> Two waves overlap and combine (constructive: amplitudes add; destructive: cancel out)</p>

      <h3>Sound Waves</h3>
      <p>Sound is a longitudinal wave traveling through a medium (air, water, solid).</p>
      <p><strong>Why sound travels faster in water than air:</strong> Water molecules are closer together, so vibrations transmit more efficiently.</p>
      <p><strong>Speed of sound in different media:</strong></p>
      <ul>
        <li>Air (20°C): ~343 m/s</li>
        <li>Water: ~1,480 m/s (4× faster!)</li>
        <li>Steel: ~5,960 m/s</li>
      </ul>

      <h3>Electromagnetic Radiation</h3>
      <p>Light is an electromagnetic (EM) wave that doesn't need a medium — it can travel through vacuum.</p>
      <p><strong>Speed of light:</strong> 3 × 10⁸ m/s (same in all media, though slightly slower in water)</p>
      <p><strong>EM Spectrum:</strong> Radio waves → Microwaves → Infrared → Visible light → Ultraviolet → X-rays → Gamma rays</p>
      <p>All travel at the same speed, but have different frequencies and wavelengths!</p>

      <h3>Key Concepts to Remember</h3>
      <ul>
        <li>Waves transfer ENERGY, not matter</li>
        <li>v = f × λ applies to ALL waves</li>
        <li>Higher frequency = shorter wavelength (inverse relationship)</li>
        <li>Sound needs a medium; light doesn't</li>
        <li>Wave properties explain behavior (reflection, refraction, interference)</li>
      </ul>
    `
  },

  visualizations: [
    {
      id: 'rope-wave-interactive',
      type: 'interactive-animation',
      title: 'Rope Wave Animation',
      description: 'Interactive rope with amplitude control. Blue arrow shows particle motion, red shows wave direction.',
      svgComponent: 'RopeWaveAnimation'
    },
    {
      id: 'particle-motion-visualization',
      type: 'svg-animation',
      title: 'Single Particle Oscillation',
      description: 'Watch how a single particle oscillates up and down as the wave passes through',
      svgComponent: 'ParticleMotionVisualization'
    },
    {
      id: 'wave-properties-interactive',
      type: 'interactive-graph',
      title: 'Wave Properties Explorer',
      description: 'Adjust amplitude and wavelength with sliders. See real-time wave visualization and measurements.',
      svgComponent: 'WavePropertiesInteractive'
    },
    {
      id: 'transverse-vs-longitudinal',
      type: 'interactive-comparison',
      title: 'Transverse vs Longitudinal Waves',
      description: 'Side-by-side comparison showing perpendicular (transverse) vs parallel (longitudinal) particle motion',
      svgComponent: 'TransverseVsLongitudinalComparison'
    },
    {
      id: 'spring-compression-visualization',
      type: 'svg-animation',
      title: 'Spring Compression Wave',
      description: 'Watch coils compress and stretch to show compression and rarefaction in longitudinal waves',
      svgComponent: 'SpringCompressionVisualization'
    },
    {
      id: 'sound-wave-visualization',
      type: 'svg-animation',
      title: 'Sound Wave: Pressure Variations',
      description: 'Visualize sound as a longitudinal wave of pressure variations traveling through air',
      svgComponent: 'SoundWaveVisualization'
    },
    {
      id: 'longitudinal-wave-properties',
      type: 'interactive-graph',
      title: 'Longitudinal Wave Properties',
      description: 'Adjust frequency and see compression/rarefaction pattern with interactive wavelength measurement',
      svgComponent: 'LongitudinalWaveProperties'
    },
    {
      id: 'comprehensive-wave-properties',
      type: 'interactive-simulator',
      title: 'Wave Equation: v = f × λ',
      description: 'Master tool to explore speed, frequency, and wavelength relationships. Adjust any two and see the third change.',
      svgComponent: 'ComprehensiveWavePropertiesExplorer'
    },
    {
      id: 'em-spectrum-visualization',
      type: 'interactive-reference',
      title: 'Electromagnetic Spectrum',
      description: 'Explore all types of EM radiation from radio waves to gamma rays. Click each type to see frequency, wavelength, and uses.',
      svgComponent: 'EMSpectrumVisualization'
    }
  ],

  workedExamples: [
    {
      id: 'example-1-wave-speed',
      difficulty: 'easy',
      title: 'Calculate Wave Speed',
      problem: 'A wave has frequency 5 Hz and wavelength 2 m. Calculate the wave speed.',
      steps: [
        {
          step: 1,
          action: 'Identify given values',
          explanation: 'We know frequency and wavelength',
          work: 'f = 5 Hz, λ = 2 m'
        },
        {
          step: 2,
          action: 'Recall the wave equation',
          explanation: 'v = f × λ',
          work: 'This relates wave speed to frequency and wavelength'
        },
        {
          step: 3,
          action: 'Substitute values',
          explanation: '',
          work: 'v = 5 × 2 = 10 m/s'
        }
      ],
      answer: '10 m/s',
      commonMistakes: [
        'Dividing instead of multiplying: 5 ÷ 2 = 2.5 ❌',
        'Forgetting to include units'
      ]
    },
    {
      id: 'example-2-wavelength',
      difficulty: 'medium',
      title: 'Find Wavelength from Speed and Frequency',
      problem: 'Sound travels at 340 m/s in air with frequency 170 Hz. What is the wavelength?',
      steps: [
        {
          step: 1,
          action: 'Identify values',
          explanation: 'v = 340 m/s, f = 170 Hz',
          work: 'Need to find: λ'
        },
        {
          step: 2,
          action: 'Rearrange v = f × λ',
          explanation: 'Divide both sides by f',
          work: 'λ = v / f'
        },
        {
          step: 3,
          action: 'Substitute',
          explanation: '',
          work: 'λ = 340 / 170 = 2 m'
        }
      ],
      answer: '2 m',
      commonMistakes: [
        'Not rearranging the formula',
        'Multiplying instead of dividing'
      ]
    },
    {
      id: 'example-3-transverse-vs-longitudinal',
      difficulty: 'easy',
      title: 'Distinguish Transverse and Longitudinal Waves',
      problem: 'Classify these as transverse or longitudinal: (a) water ripples, (b) sound, (c) light',
      steps: [
        {
          step: 1,
          action: 'Water ripples',
          explanation: 'Water moves up and down (perpendicular) as wave travels horizontally',
          work: 'Transverse'
        },
        {
          step: 2,
          action: 'Sound',
          explanation: 'Air molecules compress and stretch (parallel) in direction of wave travel',
          work: 'Longitudinal'
        },
        {
          step: 3,
          action: 'Light',
          explanation: 'Electric and magnetic fields oscillate perpendicular to direction',
          work: 'Transverse'
        }
      ],
      answer: '(a) Transverse, (b) Longitudinal, (c) Transverse',
      commonMistakes: []
    },
    {
      id: 'example-4-sound-speed',
      difficulty: 'medium',
      title: 'Why Sound Travels Faster in Water',
      problem: 'Explain why sound travels 4× faster in water than air.',
      steps: [
        {
          step: 1,
          action: 'Understand wave transmission',
          explanation: 'Waves travel by particles vibrating and transferring energy to neighbors',
          work: ''
        },
        {
          step: 2,
          action: 'Compare densities',
          explanation: 'Water molecules are much closer together than air molecules',
          work: 'More molecules per unit volume'
        },
        {
          step: 3,
          action: 'Effect on vibration transmission',
          explanation: 'Closer molecules transfer vibrations more efficiently',
          work: 'Energy spreads faster through denser medium'
        },
        {
          step: 4,
          action: 'Conclusion',
          explanation: 'Denser medium → faster wave speed',
          work: 'Sound in water (1,480 m/s) vs air (343 m/s)'
        }
      ],
      answer: 'Water molecules are closer together, so vibrations transmit more efficiently',
      commonMistakes: [
        'Thinking waves themselves move faster (no — properties vary)',
        'Confusing density with wave speed'
      ]
    },
    {
      id: 'example-5-frequency-wavelength',
      difficulty: 'hard',
      title: 'Inverse Relationship: Frequency vs Wavelength',
      problem: 'If a sound wave\'s frequency doubles but wave speed stays constant, what happens to wavelength?',
      steps: [
        {
          step: 1,
          action: 'Start with wave equation',
          explanation: 'v = f × λ',
          work: ''
        },
        {
          step: 2,
          action: 'Rearrange for wavelength',
          explanation: 'λ = v / f',
          work: 'Wavelength is inversely proportional to frequency'
        },
        {
          step: 3,
          action: 'Double the frequency',
          explanation: 'f becomes 2f',
          work: 'λ_new = v / (2f) = (1/2) × (v/f) = (1/2) × λ_old'
        },
        {
          step: 4,
          action: 'Conclusion',
          explanation: 'Wavelength is halved',
          work: 'Higher frequency → shorter wavelength'
        }
      ],
      answer: 'Wavelength is halved (cut in half)',
      commonMistakes: [
        'Thinking both increase together',
        'Forgetting that v is constant'
      ]
    },
    {
      id: 'example-6-em-spectrum',
      difficulty: 'medium',
      title: 'Electromagnetic Spectrum',
      problem: 'Radio waves and gamma rays both travel at 3×10⁸ m/s. Which has higher frequency?',
      steps: [
        {
          step: 1,
          action: 'Use wave equation',
          explanation: 'v = f × λ, so f = v / λ',
          work: ''
        },
        {
          step: 2,
          action: 'Compare wavelengths',
          explanation: 'Radio waves have very long wavelengths (~meters to km)',
          work: 'Gamma rays have very short wavelengths (~10⁻¹² m)'
        },
        {
          step: 3,
          action: 'Apply relationship',
          explanation: 'Since v is same, higher frequency requires shorter wavelength',
          work: 'Gamma rays have shorter λ → higher f'
        },
        {
          step: 4,
          action: 'Conclusion',
          explanation: 'γ-rays have much higher frequency than radio waves',
          work: 'This is why γ-rays are dangerous (high energy = high frequency)'
        }
      ],
      answer: 'Gamma rays have higher frequency (shorter wavelength)',
      commonMistakes: []
    },
    {
      id: 'example-7-rope-amplitude',
      difficulty: 'easy',
      title: 'Amplitude in a Rope Wave',
      problem: 'A person flicks a rope up and down. The rope tip moves 0.3 m up and 0.3 m down from rest. What is the amplitude?',
      steps: [
        {
          step: 1,
          action: 'Understand amplitude',
          explanation: 'Amplitude is the maximum distance from the rest position',
          work: 'Amplitude = max displacement'
        },
        {
          step: 2,
          action: 'Identify maximum displacement',
          explanation: 'The rope moves 0.3 m up from rest and 0.3 m down from rest',
          work: 'Maximum displacement = 0.3 m'
        },
        {
          step: 3,
          action: 'Calculate amplitude',
          explanation: 'The amplitude is this maximum distance',
          work: 'A = 0.3 m'
        },
        {
          step: 4,
          action: 'Key insight',
          explanation: 'Amplitude doesn\'t depend on how far we measure — it\'s always the max distance',
          work: 'Whether we measure up or down, the answer is the same: 0.3 m'
        }
      ],
      answer: '0.3 m',
      commonMistakes: [
        'Adding up and down: 0.3 + 0.3 = 0.6 m ❌ (amplitude is max distance, not total)',
        'Confusing amplitude with wavelength'
      ]
    },
    {
      id: 'example-8-water-wave-period',
      difficulty: 'medium',
      title: 'Period from Frequency (Water Waves)',
      problem: 'Water waves have frequency 2 Hz. What is the period (time for one complete wave)?',
      steps: [
        {
          step: 1,
          action: 'Define period',
          explanation: 'Period (T) is the time for ONE complete oscillation',
          work: 'Measured in seconds'
        },
        {
          step: 2,
          action: 'Recall relationship',
          explanation: 'Period and frequency are inverse: T = 1/f',
          work: 'This is because f counts how many per second'
        },
        {
          step: 3,
          action: 'Substitute frequency',
          explanation: 'f = 2 Hz means 2 waves per second',
          work: 'T = 1/2 = 0.5 seconds'
        },
        {
          step: 4,
          action: 'Verify',
          explanation: 'If one wave takes 0.5 seconds, then in 1 second we get 2 waves ✓',
          work: 'f × T = 2 × 0.5 = 1 ✓'
        }
      ],
      answer: '0.5 seconds (or 0.5 s)',
      commonMistakes: [
        'Multiplying instead of dividing: 1 × 2 = 2 ❌',
        'Forgetting units'
      ]
    },
    {
      id: 'example-9-wave-speed-from-rope',
      difficulty: 'hard',
      title: 'Calculate Wave Speed from Rope Motion',
      problem: 'A person creates waves on a rope. The waves have wavelength 1 m and the person flicks the rope 3 times per second. How fast do the waves travel?',
      steps: [
        {
          step: 1,
          action: 'Extract given information',
          explanation: 'Person flicks 3 times per second = frequency; wavelength = 1 m',
          work: 'λ = 1 m, f = 3 Hz'
        },
        {
          step: 2,
          action: 'Identify needed value',
          explanation: 'We need wave speed, which uses v = f × λ',
          work: 'This is the wave equation'
        },
        {
          step: 3,
          action: 'Calculate',
          explanation: 'Multiply frequency and wavelength',
          work: 'v = 3 × 1 = 3 m/s'
        },
        {
          step: 4,
          action: 'Interpret result',
          explanation: 'Each second, 3 complete waves travel 1 m each',
          work: 'Wave crest moves 3 meters forward per second'
        }
      ],
      answer: '3 m/s',
      commonMistakes: [
        'Dividing instead of multiplying: 3 ÷ 1 = 3 (happens to work here, but wrong method)',
        'Not recognizing that "3 times per second" = frequency'
      ]
    },
    {
      id: 'example-10-amplitude-vs-wave-speed',
      difficulty: 'hard',
      title: 'Amplitude Does NOT Affect Wave Speed',
      problem: 'Two identical ropes have identical waves, but one person flicks harder (larger amplitude). Does wave speed change?',
      steps: [
        {
          step: 1,
          action: 'Recall wave speed equation',
          explanation: 'v = f × λ',
          work: 'Wave speed depends only on frequency and wavelength'
        },
        {
          step: 2,
          action: 'Check what changed',
          explanation: 'Only amplitude changed (one rope flicked harder)',
          work: 'Frequency and wavelength stay the same'
        },
        {
          step: 3,
          action: 'Apply logic',
          explanation: 'Since f and λ are unchanged, v must be unchanged',
          work: 'v = f × λ is still the same value'
        },
        {
          step: 4,
          action: 'Physical insight',
          explanation: 'Amplitude affects ENERGY (bigger waves = more energy), not speed',
          work: 'Wave travels at same speed, but carries more energy'
        }
      ],
      answer: 'No, wave speed does NOT change. Amplitude affects energy, not speed.',
      commonMistakes: [
        'Thinking louder/bigger = faster ❌ (louder means more energy, not faster)',
        'Confusing amplitude with wavelength'
      ]
    },
    {
      id: 'example-11-sound-speed-calculation',
      difficulty: 'easy',
      title: 'Calculate Sound Wavelength in Air',
      problem: 'A sound wave has frequency 440 Hz and travels at 343 m/s in air. What is the wavelength?',
      steps: [
        {
          step: 1,
          action: 'Identify values',
          explanation: 'f = 440 Hz (musical note A), v = 343 m/s',
          work: 'Need to find: λ'
        },
        {
          step: 2,
          action: 'Use wave equation rearranged',
          explanation: 'v = f × λ, so λ = v / f',
          work: 'Wavelength = speed ÷ frequency'
        },
        {
          step: 3,
          action: 'Substitute values',
          explanation: '',
          work: 'λ = 343 / 440 = 0.78 m'
        },
        {
          step: 4,
          action: 'Interpret result',
          explanation: 'Sound has much longer wavelength than light',
          work: 'This 0.78m wavelength is why we can hear around corners'
        }
      ],
      answer: '0.78 m (or approximately 0.8 m)',
      commonMistakes: [
        'Multiplying instead of dividing: 440 × 343 ❌',
        'Forgetting that air speed is fixed'
      ]
    },
    {
      id: 'example-12-sound-in-different-media',
      difficulty: 'medium',
      title: 'Sound Speed in Water vs Air',
      problem: 'A sound wave has frequency 100 Hz. In air: v=343 m/s, In water: v=1480 m/s. Which has longer wavelength?',
      steps: [
        {
          step: 1,
          action: 'Find wavelength in air',
          explanation: 'λ_air = v_air / f',
          work: 'λ_air = 343 / 100 = 3.43 m'
        },
        {
          step: 2,
          action: 'Find wavelength in water',
          explanation: 'λ_water = v_water / f',
          work: 'λ_water = 1480 / 100 = 14.8 m'
        },
        {
          step: 3,
          action: 'Compare',
          explanation: 'Same frequency, but different speeds → different wavelengths',
          work: '14.8 m &gt; 3.43 m'
        },
        {
          step: 4,
          action: 'Key insight',
          explanation: 'Higher speed medium = longer wavelength (at same frequency)',
          work: 'Water: wavelength is 4.3× longer than in air'
        }
      ],
      answer: 'Water has longer wavelength (14.8 m vs 3.43 m)',
      commonMistakes: [
        'Thinking water is "denser" so wavelength is shorter ❌ (density affects speed, speed determines wavelength)',
        'Forgetting frequency is the same in both media'
      ]
    },
    {
      id: 'example-13-frequency-period-sound',
      difficulty: 'medium',
      title: 'Period and Frequency in Sound Waves',
      problem: 'A tuning fork vibrates at 256 Hz (middle C note). What is the period of oscillation?',
      steps: [
        {
          step: 1,
          action: 'Define period',
          explanation: 'Period (T) is time for ONE complete oscillation/compression-rarefaction cycle',
          work: 'T = 1 / f'
        },
        {
          step: 2,
          action: 'Substitute frequency',
          explanation: 'f = 256 Hz',
          work: 'T = 1 / 256'
        },
        {
          step: 3,
          action: 'Calculate',
          explanation: '',
          work: 'T = 0.00391 seconds = 3.91 milliseconds'
        },
        {
          step: 4,
          action: 'Interpret',
          explanation: 'The sound repeats 256 times per second (very fast!)',
          work: 'Each cycle takes about 4 milliseconds'
        }
      ],
      answer: '0.00391 s or 3.91 ms (milliseconds)',
      commonMistakes: [
        'Multiplying instead of dividing: 256 × 1 ❌',
        'Not converting to milliseconds for easier understanding'
      ]
    },
    {
      id: 'example-14-compression-rarefaction-distance',
      difficulty: 'hard',
      title: 'Distance Between Compressions in Sound Wave',
      problem: 'Sound at 1000 Hz travels at 343 m/s in air. What is the distance between successive compression centers?',
      steps: [
        {
          step: 1,
          action: 'Recognize the question',
          explanation: 'Distance between compression centers = wavelength',
          work: 'Longitudinal wave: compression-to-compression = one wavelength'
        },
        {
          step: 2,
          action: 'Use wave equation',
          explanation: 'λ = v / f',
          work: 'This works for longitudinal waves too'
        },
        {
          step: 3,
          action: 'Substitute values',
          explanation: 'v = 343 m/s, f = 1000 Hz',
          work: 'λ = 343 / 1000 = 0.343 m'
        },
        {
          step: 4,
          action: 'Convert to useful units',
          explanation: '0.343 m = 34.3 cm = 343 mm',
          work: 'About one-third of a meter between compressions'
        }
      ],
      answer: '0.343 m (or 34.3 cm)',
      commonMistakes: [
        'Thinking compressions are at different distances than wavelength',
        'Not recognizing that spacing determines wavelength'
      ]
    },
    {
      id: 'example-15-wave-medium-speed-change',
      difficulty: 'medium',
      title: 'How Wave Speed Changes with Medium',
      problem: 'Light enters water from air (speed changes from 3×10⁸ m/s to 2.25×10⁸ m/s). If frequency stays constant, what happens to wavelength?',
      steps: [
        {
          step: 1,
          action: 'Identify what changes',
          explanation: 'Speed CHANGES, but frequency DOESN\'T (source stays same)',
          work: 'Speed: 3×10⁸ → 2.25×10⁸ m/s (slower in water)'
        },
        {
          step: 2,
          action: 'Use wave equation',
          explanation: 'λ = v / f (wavelength depends on speed and frequency)',
          work: 'Since f is constant, wavelength is proportional to speed'
        },
        {
          step: 3,
          action: 'Compare wavelengths',
          explanation: 'λ_water / λ_air = v_water / v_air',
          work: 'λ_water / λ_air = 2.25×10⁸ / 3×10⁸ = 0.75'
        },
        {
          step: 4,
          action: 'Conclusion',
          explanation: 'Wavelength in water is 75% of wavelength in air',
          work: 'Slower speed → shorter wavelength (same frequency)'
        }
      ],
      answer: 'Wavelength decreases. λ_water = 0.75 × λ_air',
      commonMistakes: [
        'Thinking frequency changes ❌ (source stays same)',
        'Thinking speed is independent of medium'
      ]
    },
    {
      id: 'example-16-em-spectrum-frequency-wavelength',
      difficulty: 'medium',
      title: 'EM Spectrum: Frequency vs Wavelength',
      problem: 'Red light (longer wavelength) and X-rays (shorter wavelength) both travel at 3×10⁸ m/s. Which has higher frequency?',
      steps: [
        {
          step: 1,
          action: 'Given information',
          explanation: 'Red light: longer wavelength; X-rays: shorter wavelength',
          work: 'Both travel at same speed: 3×10⁸ m/s'
        },
        {
          step: 2,
          action: 'Use wave equation',
          explanation: 'v = f × λ, so f = v / λ',
          work: 'Frequency is inversely proportional to wavelength'
        },
        {
          step: 3,
          action: 'Compare frequencies',
          explanation: 'Shorter wavelength → higher frequency',
          work: 'X-rays have shorter λ → X-rays have higher f'
        },
        {
          step: 4,
          action: 'Energy consideration',
          explanation: 'Higher frequency EM radiation carries more energy',
          work: 'X-rays are dangerous because f is very high'
        }
      ],
      answer: 'X-rays have higher frequency (shorter wavelength)',
      commonMistakes: [
        'Thinking red light is more energetic ❌ (red is visible, but low frequency)',
        'Not recognizing frequency-energy relationship'
      ]
    },
    {
      id: 'example-17-microwave-heating',
      difficulty: 'hard',
      title: 'Microwave Frequency and Wavelength',
      problem: 'Microwaves used in ovens have frequency 2.45 GHz (2.45×10⁹ Hz). Calculate their wavelength in air.',
      steps: [
        {
          step: 1,
          action: 'Identify values',
          explanation: 'f = 2.45×10⁹ Hz, v = 3×10⁸ m/s',
          work: 'These are the known values'
        },
        {
          step: 2,
          action: 'Use wave equation',
          explanation: 'λ = v / f',
          work: 'Wavelength = speed ÷ frequency'
        },
        {
          step: 3,
          action: 'Calculate',
          explanation: '',
          work: 'λ = 3×10⁸ / 2.45×10⁹ = 0.122 m'
        },
        {
          step: 4,
          action: 'Convert units',
          explanation: '0.122 m = 12.2 cm',
          work: 'Microwave wavelength is about 12 cm'
        }
      ],
      answer: '0.122 m (or 12.2 cm)',
      commonMistakes: [
        'Not converting GHz to Hz: 2.45×10⁹ not 2.45',
        'Multiplying instead of dividing'
      ]
    }
  ],

  practiceQuestions: [
    {
      id: 'practice-1',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Which is a transverse wave?',
      options: ['Sound wave', 'Compression wave', 'Water ripple', 'Earthquake P-wave'],
      correctAnswer: 'Water ripple',
      explanation: 'Water ripples have particles moving perpendicular to wave direction'
    },
    {
      id: 'practice-2',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'Wave speed equation: v = ___',
      correctAnswers: ['f × λ', 'f*λ', 'frequency × wavelength'],
      explanation: ''
    },
    {
      id: 'practice-3',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'If wavelength doubles and frequency stays same, wave speed will:',
      options: ['Double', 'Half', 'Stay the same', 'Quadruple'],
      correctAnswer: 'Double',
      explanation: 'v = f × λ, so if λ doubles, v doubles'
    },
    {
      id: 'practice-4',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Wave with f=100 Hz, λ=0.5 m has speed: ___ m/s',
      correctAnswers: ['50', '50 m/s'],
      explanation: 'v = 100 × 0.5 = 50'
    },
    {
      id: 'practice-5',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Why does sound travel fastest in solids?',
      options: ['More energy', 'Molecules closer together', 'Lower temperature', 'Higher frequency'],
      correctAnswer: 'Molecules closer together',
      explanation: 'Denser mediums transmit vibrations more efficiently'
    },
    {
      id: 'practice-6',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Speed of light in vacuum:',
      options: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'],
      correctAnswer: '3×10⁸ m/s',
      explanation: ''
    },
    {
      id: 'practice-7',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Sound at 170 Hz has λ=2m in air. Speed = ___ m/s',
      correctAnswers: ['340', '340 m/s'],
      explanation: 'v = 170 × 2'
    },
    {
      id: 'practice-8',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Light ray bends toward normal when entering glass. This is:',
      options: ['Reflection', 'Refraction', 'Diffraction', 'Interference'],
      correctAnswer: 'Refraction',
      explanation: 'Light bends when entering a denser medium'
    },
    {
      id: 'practice-9',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'What happens when two waves meet in phase?',
      options: ['Interference (constructive)', 'Interference (destructive)', 'Reflection', 'Refraction'],
      correctAnswer: 'Interference (constructive)',
      explanation: 'In-phase waves add up to larger amplitude'
    },
    {
      id: 'practice-10',
      type: 'fill-blank',
      difficulty: 'hard',
      question: 'Frequency triples, speed constant → wavelength becomes ___ of original',
      correctAnswers: ['1/3', 'one-third', 'one third'],
      explanation: 'λ = v/f, if f×3, then λ becomes λ/3'
    },
    {
      id: 'practice-11',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'When a rope wave passes, what happens to a single particle on the rope?',
      options: ['Moves forward with the wave', 'Moves up and down, then returns to rest', 'Disappears temporarily', 'Stays completely still'],
      correctAnswer: 'Moves up and down, then returns to rest',
      explanation: 'Particles oscillate perpendicular to wave motion in transverse waves'
    },
    {
      id: 'practice-12',
      type: 'fill-blank',
      difficulty: 'easy',
      question: 'Period T is the time for ___ complete oscillation(s)',
      correctAnswers: ['one', '1'],
      explanation: 'Period = time for one full cycle'
    },
    {
      id: 'practice-13',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'A transverse wave has λ=0.5m and v=10m/s. Frequency is:',
      options: ['5 Hz', '20 Hz', '0.05 Hz', '50 Hz'],
      correctAnswer: '20 Hz',
      explanation: 'f = v/λ = 10/0.5 = 20 Hz'
    },
    {
      id: 'practice-14',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'If T = 0.2s, frequency = ___ Hz',
      correctAnswers: ['5', '5 Hz'],
      explanation: 'f = 1/T = 1/0.2 = 5'
    },
    {
      id: 'practice-15',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Two transverse waves: Wave A (f=10Hz, λ=2m) and Wave B (f=5Hz, λ=4m). Which travels faster?',
      options: ['Wave A', 'Wave B', 'Same speed', 'Cannot determine'],
      correctAnswer: 'Same speed',
      explanation: 'Wave A: v=10×2=20 m/s; Wave B: v=5×4=20 m/s — same speed'
    },
    {
      id: 'practice-16',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Rope wave: person flicks 4 times/sec, distance between crests is 0.5m → speed = ___ m/s',
      correctAnswers: ['2', '2 m/s'],
      explanation: 'f=4Hz, λ=0.5m → v=4×0.5=2'
    },
    {
      id: 'practice-17',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Amplitude increases but frequency/wavelength constant. Energy of wave:',
      options: ['Decreases', 'Stays same', 'Increases', 'Becomes zero'],
      correctAnswer: 'Increases',
      explanation: 'Higher amplitude = more particle displacement = more energy'
    },
    {
      id: 'practice-18',
      type: 'fill-blank',
      difficulty: 'hard',
      question: 'Wavelength halves, speed constant → frequency becomes ___ times original',
      correctAnswers: ['2', 'twice', 'two'],
      explanation: 'f = v/λ, if λ is halved, f doubles'
    },
    {
      id: 'practice-19',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'In a longitudinal wave, particles move:',
      options: ['Up and down', 'Left and right (parallel to wave)', 'In circles', 'Stay still'],
      correctAnswer: 'Left and right (parallel to wave)',
      explanation: 'Longitudinal waves have particle motion parallel to wave direction'
    },
    {
      id: 'practice-20',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Compression in a sound wave is where:',
      options: ['Particles are far apart', 'Particles are close together', 'No particles exist', 'Particles move fastest'],
      correctAnswer: 'Particles are close together',
      explanation: 'Compression = high density region where particles are packed closely'
    },
    {
      id: 'practice-21',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Sound: f=500Hz, v=340m/s → λ = ___ m',
      correctAnswers: ['0.68', '0.68 m'],
      explanation: 'λ = 340/500 = 0.68'
    },
    {
      id: 'practice-22',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'Why does sound travel faster in water than in air?',
      options: ['Water is colder', 'Water molecules are closer together', 'Sound is louder in water', 'Water has less resistance'],
      correctAnswer: 'Water molecules are closer together',
      explanation: 'Denser medium allows vibrations to transmit more efficiently'
    },
    {
      id: 'practice-23',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Sound with T=0.01s has frequency ___ Hz',
      correctAnswers: ['100', '100 Hz'],
      explanation: 'f = 1/T = 1/0.01 = 100'
    },
    {
      id: 'practice-24',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Low frequency sound (20Hz) vs high frequency (20,000Hz), same speed. Which has longer wavelength?',
      options: ['20 Hz (longer wavelength)', '20,000 Hz (longer wavelength)', 'Same wavelength', 'Cannot determine'],
      correctAnswer: '20 Hz (longer wavelength)',
      explanation: 'λ = v/f, so lower frequency → longer wavelength'
    },
    {
      id: 'practice-25',
      type: 'fill-blank',
      difficulty: 'hard',
      question: 'Sound in steel (5960 m/s) at 1000Hz → λ = ___ m',
      correctAnswers: ['5.96', '5.96 m', '6'],
      explanation: 'λ = 5960/1000 = 5.96'
    },
    {
      id: 'practice-26',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'A compression and rarefaction together make:',
      options: ['One cycle', 'One wavelength', 'Half a wavelength', 'The amplitude'],
      correctAnswer: 'One wavelength',
      explanation: 'One complete compression-rarefaction pattern = 1 wavelength'
    },
    {
      id: 'practice-27',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Light enters water (slower). Frequency stays same → wavelength becomes ___ (longer/shorter)',
      correctAnswers: ['shorter', 'shorter wavelength'],
      explanation: 'λ = v/f, lower speed → shorter wavelength (f unchanged)'
    },
    {
      id: 'practice-28',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'EM spectrum order (highest to lowest frequency):',
      options: ['Radio, visible, gamma', 'Gamma, visible, radio', 'Visible, gamma, radio', 'Radio, gamma, visible'],
      correctAnswer: 'Gamma, visible, radio',
      explanation: 'Gamma rays have highest frequency, radio waves have lowest'
    },
    {
      id: 'practice-29',
      type: 'fill-blank',
      difficulty: 'medium',
      question: 'Microwave f=2.45×10⁹ Hz, v=3×10⁸ m/s → λ = ___ m',
      correctAnswers: ['0.122', '0.12', '0.122 m'],
      explanation: 'λ = 3×10⁸ / 2.45×10⁹ = 0.122'
    },
    {
      id: 'practice-30',
      type: 'multiple-choice',
      difficulty: 'easy',
      question: 'Which EM radiation is most dangerous?',
      options: ['Radio waves', 'Infrared', 'X-rays', 'Visible light'],
      correctAnswer: 'X-rays',
      explanation: 'X-rays have very high frequency = high energy'
    },
    {
      id: 'practice-31',
      type: 'multiple-choice',
      difficulty: 'medium',
      question: 'If wave speed doubles but frequency stays same:',
      options: ['Wavelength doubles', 'Wavelength halves', 'Wavelength stays same', 'Wavelength triples'],
      correctAnswer: 'Wavelength doubles',
      explanation: 'λ = v/f, if v doubles, λ doubles'
    },
    {
      id: 'practice-32',
      type: 'fill-blank',
      difficulty: 'hard',
      question: 'Speed of light (3×10⁸ m/s) / Frequency of red light (4.3×10¹⁴ Hz) = λ ___ m',
      correctAnswers: ['6.98×10⁻⁷', '7×10⁻⁷'],
      explanation: 'λ = 3×10⁸ / 4.3×10¹⁴ ≈ 7×10⁻⁷'
    },
    {
      id: 'practice-33',
      type: 'multiple-choice',
      difficulty: 'hard',
      question: 'Visible light wavelength (smaller) vs Radio wave (larger), same speed. Ratio of their frequencies f_light / f_radio:',
      options: ['Much larger', 'Equal', 'Much smaller', 'Cannot determine'],
      correctAnswer: 'Much larger',
      explanation: 'f = v/λ, smaller λ → larger f. Light has much smaller λ → much larger f'
    }
  ],

  topicQuiz: {
    id: 'waves-sound-light-quiz',
    title: 'Waves, Sound & Light Quiz',
    passingScore: 70,
    questions: [
      {
        id: 'quiz-1',
        type: 'multiple-choice',
        question: 'A wave is a disturbance that transfers:',
        options: ['Matter', 'Energy', 'Both matter and energy', 'Only particles'],
        correctAnswer: 'Energy',
        explanation: ''
      },
      {
        id: 'quiz-2',
        type: 'fill-blank',
        question: 'In transverse waves, particle motion is _____ to wave direction',
        correctAnswers: ['perpendicular', 'perpendicular to'],
        explanation: ''
      },
      {
        id: 'quiz-3',
        type: 'multiple-choice',
        question: 'Sound is which type of wave?',
        options: ['Transverse', 'Longitudinal', 'Both', 'Neither'],
        correctAnswer: 'Longitudinal',
        explanation: ''
      },
      {
        id: 'quiz-4',
        type: 'fill-blank',
        question: 'v = ___ × λ (wave equation)',
        correctAnswers: ['f', 'frequency'],
        explanation: ''
      },
      {
        id: 'quiz-5',
        type: 'multiple-choice',
        question: 'If frequency increases, wavelength (at constant speed):',
        options: ['Increases', 'Decreases', 'Stays same', 'Doubles'],
        correctAnswer: 'Decreases',
        explanation: ''
      },
      {
        id: 'quiz-6',
        type: 'fill-blank',
        question: 'Speed of light = ___ m/s',
        correctAnswers: ['3×10⁸', '3 × 10^8', '300000000'],
        explanation: ''
      },
      {
        id: 'quiz-7',
        type: 'multiple-choice',
        question: 'Sound travels fastest in:',
        options: ['Air', 'Water', 'Steel', 'Vacuum'],
        correctAnswer: 'Steel',
        explanation: 'Densest medium = fastest transmission'
      },
      {
        id: 'quiz-8',
        type: 'multiple-choice',
        question: 'Light bending at interface is:',
        options: ['Reflection', 'Refraction', 'Diffraction', 'Dispersion'],
        correctAnswer: 'Refraction',
        explanation: ''
      },
      {
        id: 'quiz-9',
        type: 'fill-blank',
        question: 'Wavelength distance from ___ to ___',
        correctAnswers: ['crest to crest', 'peak to peak', 'one peak to next peak'],
        explanation: ''
      },
      {
        id: 'quiz-10',
        type: 'multiple-choice',
        question: 'EM spectrum includes (highest to lowest frequency):',
        options: ['Radio, visible, gamma', 'Gamma, visible, radio', 'Visible, gamma, radio', 'Radio, gamma, visible'],
        correctAnswer: 'Gamma, visible, radio',
        explanation: ''
      }
    ]
  },

  practiceExam: {
    id: 'waves-sound-light-exam',
    title: 'Waves, Sound & Light Practice Exam',
    timeLimit: 5400,
    totalMarks: 100,
    questions: [
      {
        id: 'exam-1',
        marks: 3,
        type: 'fill-blank',
        question: 'Calculate wave speed: f=50Hz, λ=0.4m → v= ___ m/s',
        correctAnswers: ['20', '20 m/s'],
        explanation: ''
      },
      {
        id: 'exam-2',
        marks: 3,
        type: 'multiple-choice',
        question: 'Wavelength is distance from:',
        options: ['Any point to next same point', 'Crest to trough', 'Center to amplitude', 'Start to end'],
        correctAnswer: 'Any point to next same point',
        explanation: ''
      },
      {
        id: 'exam-3',
        marks: 3,
        type: 'fill-blank',
        question: 'Sound in water (1480 m/s), f=440Hz → λ= ___ m',
        correctAnswers: ['3.36', '3.4', '336/100'],
        explanation: 'λ = v/f = 1480/440'
      },
      {
        id: 'exam-4',
        marks: 4,
        type: 'multiple-choice',
        question: 'Why is sound faster in water than air?',
        options: ['Water is colder', 'Molecules are closer', 'Higher pressure', 'Less friction'],
        correctAnswer: 'Molecules are closer',
        explanation: ''
      },
      {
        id: 'exam-5',
        marks: 3,
        type: 'fill-blank',
        question: 'If frequency doubles (speed constant), wavelength becomes ___ ',
        correctAnswers: ['1/2', 'half', 'one half'],
        explanation: ''
      },
      {
        id: 'exam-6',
        marks: 4,
        type: 'multiple-choice',
        question: 'Light ray bends away from normal entering less dense medium:',
        options: ['Always', 'Never', 'Sometimes', 'Only in prism'],
        correctAnswer: 'Never',
        explanation: 'Light bends toward normal entering denser medium'
      },
      {
        id: 'exam-7',
        marks: 3,
        type: 'fill-blank',
        question: 'EM radiation with highest frequency is: ___',
        correctAnswers: ['gamma rays', 'gamma', 'gamma-rays'],
        explanation: ''
      },
      {
        id: 'exam-8',
        marks: 4,
        type: 'multiple-choice',
        question: 'Two waves overlap in phase → amplitude:',
        options: ['Cancels', 'Doubles', 'Stays same', 'Halves'],
        correctAnswer: 'Doubles',
        explanation: 'Constructive interference'
      },
      {
        id: 'exam-9',
        marks: 4,
        type: 'fill-blank',
        question: 'Speed of light = 3×10⁸ m/s. Light travels 1m in ___ seconds',
        correctAnswers: ['3.33×10⁻⁹', '3.3×10⁻⁹', '3.33 nanoseconds'],
        explanation: 't = 1/(3×10⁸)'
      },
      {
        id: 'exam-10',
        marks: 5,
        type: 'fill-blank',
        question: 'White light through prism shows spectrum. Explain why blue bends more than red.',
        correctAnswers: ['blue has higher frequency', 'blue has shorter wavelength', 'different speeds in glass'],
        explanation: 'Different wavelengths refract differently. Blue bends more because it has shorter wavelength'
      }
    ]
  }
};
