import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  X, 
  ChevronRight, 
  Fingerprint, 
  Sparkles,
  Info,
  BookOpen,
  Compass,
  Layers,
  Heart
} from 'lucide-react';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Define type for modal content
interface ModalContent {
  id: string;
  title: string;
  subtitle: string;
  quote: string;
  narrative: string;
  metadata: string;
  interactiveType: 'breathing' | 'scratch' | 'birthmark' | 'rivers';
}

// Poetic narratives for hotspots
const MODAL_DATA: Record<string, ModalContent> = {
  manifiesto: {
    id: 'manifiesto',
    title: 'Manifiesto del Archivo Ausente',
    subtitle: 'NUESTRA INFANCIA SIN PLACAS DE PLATA',
    quote: '"Crecer sin fotos de la infancia es aprender a recordar con la luz apagada."',
    narrative: 'En mi hogar no hay álbumes de cuero con bordes dorados, ni fotos de mi primer día de escuela, ni registros de mis abuelos sonriendo frente a una cámara analógica. Mi genealogía no es un árbol de raíces firmes; es una enredadera flotante. Para quienes no heredamos un archivo, la memoria no es un documento que se lee: es una arcilla que se amasa todos los días con lo que queda. El gomero de mi patio de la infancia, con sus hojas gruesas, carnosas y oscuras, fue el primer guardián de mi silencio. Si el papel familiar se quemó o nunca existió, las hojas vegetales recuerdan la savia que nos trajo hasta aquí. El archivo vegetal sustituye al archivo de papel.',
    metadata: 'REGISTRO 01 — MEMORIA VEGETAL / EL GOMERO DE LA INFANCIA',
    interactiveType: 'breathing'
  },
  archivo: {
    id: 'archivo',
    title: 'Voces de la Ascendencia Indígena',
    subtitle: 'LA TRANSMISIÓN SUSURRADA EN LA COCINA',
    quote: '"Del lado de mi madre, la historia se cuenta en voz baja, en la cocina, mientras se cuela el café."',
    narrative: 'No hay partidas coloniales que registren la sangre charrúa de mi linaje, ni blasones de frontera. Solo la certeza oral de que venimos de la tierra de los ríos del norte, allí donde el río Uruguay se ensancha. "Tu abuela tenía el cabello tan oscuro que brillaba azul bajo el sol, y curaba el empacho con hojas de duraznillo", me decía mamá. Esa transmisión oral es nuestro único pergamino. No busco una prueba de filiación racial o de pureza de sangre; busco habitar un silencio de generaciones, los que fueron borrados de las actas oficiales para convertirse en peones, sirvientes, o simplemente vacíos en el relato oficial de un Uruguay que decidió declararse europeo.',
    metadata: 'REGISTRO 02 — PARTIDAS IMPOSIBLES / EL SILENCIO COLONIAL',
    interactiveType: 'scratch'
  },
  marcas: {
    id: 'marcas',
    title: 'El Archivo de la Piel',
    subtitle: 'LA MARCA QUE EXCEPCIONA AL DOCUMENTO',
    quote: '"Heredé una mancha arcillosa en el cuello, una costura física contra el olvido."',
    narrative: 'Hay una mancha de nacimiento de un color arcilloso, casi violeta, en la base del cuello. La tiene mi madre. La tiene mi hermano. La tengo yo. Ningún antropólogo oficial la consideraría una prueba genética definitiva, pero para nosotros es un sello de lacre en la piel. Es la costura biológica con la que el cuerpo protesta contra la pérdida del papel. Los expedientes se pudren en los sótanos de los juzgados del interior; las fotografías se desvanecen con la humedad del invierno rioplatense; pero la marca persiste, saltando generaciones, reclamando su lugar en el presente. El cuerpo es el verdadero archivo indestructible.',
    metadata: 'REGISTRO 03 — MARCA COMPARTIDA / PERSISTENCIA CORPORAL',
    interactiveType: 'birthmark'
  },
  territorio: {
    id: 'territorio',
    title: 'El Territorio Cosido',
    subtitle: 'GEOGRAFÍAS DE LO INDOCUMENTADO',
    quote: '"El Uruguay no es un mapa político: es un tapiz de venas fluviales y cicatrices de campaña."',
    narrative: 'Nuestro territorio fue habitado por comunidades enteras mucho antes de que existieran los límites departamentales de 1830. Al bordar el mapa con hilos rojos, no dibujo divisiones limítrofes: dibujo caminos de escape, hilos de agua limpia, cicatrices de la campaña y arroyos que llevan sangre antigua. Cada puntada es una sutura sobre un territorio herido por el olvido planificado y la asimilación forzada. La tierra recuerda el peso de los pasos de nuestros ancestros antes de que nosotros aprendiéramos a nombrar sus lugares. Bordar es un acto de soberanía íntima, una forma de remapear la pertenencia.',
    metadata: 'REGISTRO 04 — RÍOS Y COSTURAS / CARTOGRAFÍA RECONSTRUIDA',
    interactiveType: 'rivers'
  }
};

// Generative soundscape engine using standard Web Audio API
class PoeticAudioEngine {
  private ctx: AudioContext | null = null;
  private droneOscs: OscillatorNode[] = [];
  private droneGains: GainNode[] = [];
  private filter: BiquadFilterNode | null = null;
  private noiseGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  public initialized = false;

  init() {
    if (this.initialized) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Low-frequency filter for deep warm pad drone
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(130, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(2.0, this.ctx.currentTime);
      this.filter.connect(this.masterGain);

      // Drones - warm cinematic minor chord (F2, C3, Eb3, Ab3) for nostalgic feeling
      const freqs = [87.31, 130.81, 155.56, 207.65];
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.filter) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = idx % 2 === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.detune.setValueAtTime((Math.random() - 0.5) * 10, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(idx === 0 ? 0.20 : 0.10, this.ctx.currentTime);
        
        osc.connect(gain);
        gain.connect(this.filter);
        
        osc.start();
        this.droneOscs.push(osc);
        this.droneGains.push(gain);
      });

      // Ambient rustle (White noise generator with bandpass filter sweep)
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(300, this.ctx.currentTime);
      noiseFilter.Q.setValueAtTime(0.5, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);
      whiteNoise.start();

      // Slow wind sweep LFO (breathing atmosphere)
      const windLFO = this.ctx.createOscillator();
      windLFO.frequency.setValueAtTime(0.05, this.ctx.currentTime); // 20s cycle
      const windLFOGain = this.ctx.createGain();
      windLFOGain.gain.setValueAtTime(120, this.ctx.currentTime);

      windLFO.connect(windLFOGain);
      windLFOGain.connect(noiseFilter.frequency);
      windLFO.start();

      // Fade in master volume
      this.masterGain.gain.linearRampToValueAtTime(0.65, this.ctx.currentTime + 3.0);
      this.initialized = true;
    } catch (e) {
      console.error("Audio initialization failed", e);
    }
  }

  playChime() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      
      chimeOsc.type = "sine";
      const notes = [523.25, 587.33, 659.25, 783.99, 880.00]; // Pentatonic scale
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      chimeOsc.frequency.setValueAtTime(randomNote, now);
      
      chimeGain.gain.setValueAtTime(0, now);
      chimeGain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      
      const delay = this.ctx.createDelay();
      delay.delayTime.setValueAtTime(0.35, now);
      const feedback = this.ctx.createGain();
      feedback.gain.setValueAtTime(0.30, now);
      
      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.masterGain);
      
      chimeGain.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(this.masterGain);
      
      chimeOsc.start();
      chimeOsc.stop(now + 2.5);
    } catch (e) {
      console.warn("Chime generation failed", e);
    }
  }

  stop() {
    if (!this.ctx || !this.masterGain) return;
    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.8);
    setTimeout(() => {
      try {
        if (this.ctx && this.ctx.state === "running") {
          this.ctx.suspend();
        }
      } catch (e) {}
    }, 900);
  }

  resume() {
    if (!this.ctx) {
      this.init();
      return;
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(0.65, this.ctx.currentTime + 1.2);
    }
  }
}

// Global Audio Engine Instance (lazy instantiated on demand)
const audioInstance = new PoeticAudioEngine();

export default function App() {
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalContent | null>(null);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [isCursorHovered, setIsCursorHovered] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [isIntroDismissed, setIsIntroDismissed] = useState(false);

  // References
  const containerRef = useRef<HTMLDivElement>(null);
  const threadSvgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // References for interactive canvases inside modals
  const scratchCanvasRef = useRef<HTMLCanvasElement>(null);
  const birthmarkCanvasRef = useRef<HTMLCanvasElement>(null);
  const riversCanvasRef = useRef<HTMLCanvasElement>(null);

  // Images imported from assets
  const leafChildhood = '/src/assets/images/leaf_childhood_1782754509707.jpg';
  const leafSecond = '/src/assets/images/leaf_second_1782754521406.jpg';
  const leafThird = '/src/assets/images/leaf_third_1782754536236.jpg';
  const mapEmbroidered = '/src/assets/images/map_embroidered_1782754549731.jpg';

  // Toggle Atmospheric Sound engine
  const handleToggleSound = () => {
    if (isPlayingSound) {
      audioInstance.stop();
      setIsPlayingSound(false);
    } else {
      audioInstance.resume();
      audioInstance.playChime();
      setIsPlayingSound(true);
    }
  };

  const triggerChime = () => {
    if (isPlayingSound) {
      audioInstance.playChime();
    }
  };

  const openHotspotModal = (id: string) => {
    triggerChime();
    setActiveModal(MODAL_DATA[id]);
  };

  const closeModal = () => {
    triggerChime();
    setActiveModal(null);
  };

  const dismissIntro = () => {
    handleToggleSound();
    setIsIntroDismissed(true);
  };

  const dismissIntroSilent = () => {
    triggerChime();
    setIsIntroDismissed(true);
  };

  // Custom Lerp Cursor (Gusta Studio inspired)
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Use GSAP quickTo for highly responsive 60fps cursor lag
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.22, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.22, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // GSAP Vertical Scroll Animation, Parallax, Reveal and Thread Drawing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // 1. Smooth Fade-in of sections
      gsap.utils.toArray<HTMLElement>('.fade-section').forEach((section) => {
        gsap.fromTo(section, 
          { opacity: 0.15, y: 30 },
          { 
            opacity: 1, 
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "top 30%",
              scrub: true,
            }
          }
        );
      });

      // 2. Background Color Shift is disabled to maintain a clean light cream background consistent with gusta.studio


      // 3. Parallax Floating on Botanical Leaf Elements (Asymmetric scrolling velocities)
      gsap.to(".leaf-parallax-1", {
        y: -100,
        rotation: 4,
        ease: "none",
        scrollTrigger: {
          trigger: "#sec_archivo_vegetal",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".leaf-parallax-2", {
        y: 120,
        rotation: -6,
        ease: "none",
        scrollTrigger: {
          trigger: "#sec_transmision",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".leaf-parallax-3", {
        y: -90,
        rotation: 8,
        ease: "none",
        scrollTrigger: {
          trigger: "#sec_marcas",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.to(".map-parallax", {
        y: 60,
        scale: 1.04,
        ease: "none",
        scrollTrigger: {
          trigger: "#sec_territorio",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // 4. Chemical Morph (Crossfade) transition on Scroll (Section II)
      gsap.to(".chemical-overlay", {
        opacity: 0.9,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "#sec_revelado",
          start: "top 60%",
          end: "top 10%",
          scrub: true
        }
      });

      // 5. Drawing the Vertical Red Thread (El Hilo) as the user scrolls down
      const path = pathRef.current;
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.0
          }
        });
      }
    }, container);

    return () => ctx.revert();
  }, [isIntroDismissed]);

  // Modal Interactive Canvas Handler
  useEffect(() => {
    if (!activeModal) return;

    // --- CASE 1: Scratch Off (Transmisión Oral) ---
    if (activeModal.interactiveType === 'scratch' && scratchCanvasRef.current) {
      const canvas = scratchCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // High-DPI canvas fix
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        ctx.fillStyle = '#1c1b18';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#dfd7c3';
        ctx.font = '12px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ARRAS_TRA EL CURSOR AQUÍ PARA REVELAR LA MEMORIA', canvas.width / 2, canvas.height / 2);

        const scratch = (x: number, y: number) => {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.beginPath();
          ctx.arc(x, y, 32, 0, Math.PI * 2);
          ctx.fill();
        };

        const handleMouseMove = (e: MouseEvent) => {
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          scratch(x, y);
        };

        const handleTouchMove = (e: TouchEvent) => {
          if (e.touches.length > 0) {
            const rect = canvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            scratch(x, y);
          }
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('touchmove', handleTouchMove);
        return () => {
          canvas.removeEventListener('mousemove', handleMouseMove);
          canvas.removeEventListener('touchmove', handleTouchMove);
        };
      }
    }

    // --- CASE 2: Pigment Birthmark (Marcas Heredadas) ---
    if (activeModal.interactiveType === 'birthmark' && birthmarkCanvasRef.current) {
      const canvas = birthmarkCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const drawMark = (x: number, y: number) => {
          const radius = Math.random() * 25 + 10;
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          gradient.addColorStop(0, 'rgba(167, 45, 45, 0.45)');
          gradient.addColorStop(0.5, 'rgba(124, 90, 67, 0.2)');
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
          
          if (isPlayingSound && Math.random() > 0.88) {
            audioInstance.playChime();
          }
        };

        const handleMouseMove = (e: MouseEvent) => {
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          drawMark(x, y);
        };

        const handleTouchMove = (e: TouchEvent) => {
          if (e.touches.length > 0) {
            const rect = canvas.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            drawMark(x, y);
          }
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('touchmove', handleTouchMove);
        return () => {
          canvas.removeEventListener('mousemove', handleMouseMove);
          canvas.removeEventListener('touchmove', handleTouchMove);
        };
      }
    }

    // --- CASE 3: River network clicks (Territorio Bordado) ---
    if (activeModal.interactiveType === 'rivers' && riversCanvasRef.current) {
      const canvas = riversCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Accurate Uruguayan geographic coordinates scaled to the canvas dimension
        const nodes = [
          { id: 0, name: "Bella Unión (Río Uruguay - Norte)", x: canvas.width * 0.28, y: canvas.height * 0.12, connected: [1] },
          { id: 1, name: "Río Arapey / Salto", x: canvas.width * 0.24, y: canvas.height * 0.26, connected: [2] },
          { id: 2, name: "Río Queguay / Paysandú", x: canvas.width * 0.25, y: canvas.height * 0.40, connected: [3] },
          { id: 3, name: "Desembocadura Río Negro / Fray Bentos", x: canvas.width * 0.27, y: canvas.height * 0.58, connected: [] },
          { id: 4, name: "Río Negro (Naciente / Rivera)", x: canvas.width * 0.72, y: canvas.height * 0.20, connected: [5] },
          { id: 5, name: "Río Negro (Tacuarembó)", x: canvas.width * 0.54, y: canvas.height * 0.33, connected: [6] },
          { id: 6, name: "Río Negro / Paso de los Toros (Centro)", x: canvas.width * 0.46, y: canvas.height * 0.48, connected: [3] },
          { id: 7, name: "Río Yi / Durazno", x: canvas.width * 0.50, y: canvas.height * 0.56, connected: [6] },
          { id: 8, name: "Río Santa Lucía / Canelones (Sutura Sur)", x: canvas.width * 0.44, y: canvas.height * 0.80, connected: [] },
          { id: 9, name: "Laguna Merín (Frontera Este / Rocha)", x: canvas.width * 0.84, y: canvas.height * 0.53, connected: [] },
          { id: 10, name: "Río Cebollatí / Treinta y Tres", x: canvas.width * 0.70, y: canvas.height * 0.62, connected: [9] }
        ];

        let ripples: { x: number; y: number; r: number; alpha: number }[] = [];
        let userConnections: [number, number][] = [];
        let selectedNodeIndex: number | null = null;
        let hoveredNodeIndex: number | null = null;
        let mouseX = 0;
        let mouseY = 0;

        const drawNetwork = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // 1. Draw natural river flows (dashed blue-gray lines mapping the actual Uruguayan waterways)
          ctx.strokeStyle = 'rgba(70, 110, 140, 0.35)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          nodes.forEach((node) => {
            node.connected.forEach((childIdx) => {
              const child = nodes[childIdx];
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(child.x, child.y);
              ctx.stroke();
            });
          });
          ctx.setLineDash([]); // Reset dash

          // 2. Draw user stitched/sewed red thread connections
          ctx.strokeStyle = '#a72d2d';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = 'rgba(167, 45, 45, 0.4)';
          ctx.shadowBlur = 4;
          userConnections.forEach(([startIdx, endIdx]) => {
            const startNode = nodes[startIdx];
            const endNode = nodes[endIdx];
            ctx.beginPath();
            ctx.moveTo(startNode.x, startNode.y);
            ctx.lineTo(endNode.x, endNode.y);
            ctx.stroke();
          });
          ctx.shadowBlur = 0; // Reset shadow

          // 3. Draw active sewing thread from selected node to the mouse cursor
          if (selectedNodeIndex !== null) {
            ctx.strokeStyle = '#a72d2d';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([2, 3]);
            ctx.beginPath();
            ctx.moveTo(nodes[selectedNodeIndex].x, nodes[selectedNodeIndex].y);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          // 4. Draw water ripples
          ripples.forEach((rp, idx) => {
            ctx.strokeStyle = `rgba(167, 45, 45, ${rp.alpha})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
            ctx.stroke();

            rp.r += 1.2;
            rp.alpha -= 0.015;

            if (rp.alpha <= 0) {
              ripples.splice(idx, 1);
            }
          });

          // 5. Draw node pins (Uruguayan Hydrographic Hubs)
          nodes.forEach((node) => {
            // Selected node has pulsing ring
            if (selectedNodeIndex === node.id) {
              ctx.strokeStyle = '#b58d63';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
              ctx.stroke();
            }

            // Outer hover ring
            if (hoveredNodeIndex === node.id) {
              ctx.fillStyle = 'rgba(181, 141, 99, 0.2)';
              ctx.beginPath();
              ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.fillStyle = hoveredNodeIndex === node.id || selectedNodeIndex === node.id ? '#1c1917' : '#b58d63';
            ctx.beginPath();
            ctx.arc(node.x, node.y, 4.5, 0, Math.PI * 2);
            ctx.fill();
          });

          // 6. Draw clean name overlay tooltip for hovered river nodes
          if (hoveredNodeIndex !== null) {
            const node = nodes[hoveredNodeIndex];
            ctx.fillStyle = '#faf9f5';
            ctx.strokeStyle = '#b58d63';
            ctx.lineWidth = 1;
            
            ctx.font = 'bold 9px monospace';
            const textWidth = ctx.measureText(node.name).width;
            const cardW = textWidth + 14;
            const cardH = 18;
            const cardX = Math.max(10, Math.min(canvas.width - cardW - 10, node.x - cardW / 2));
            const cardY = node.y - 28;
            
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(cardX, cardY, cardW, cardH, 4);
            } else {
              ctx.rect(cardX, cardY, cardW, cardH);
            }
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = '#1c1917';
            ctx.textAlign = 'left';
            ctx.fillText(node.name, cardX + 7, cardY + 12);
          }
        };

        const interval = setInterval(drawNetwork, 24);

        const handleMouseMove = (e: MouseEvent) => {
          const rect = canvas.getBoundingClientRect();
          mouseX = e.clientX - rect.left;
          mouseY = e.clientY - rect.top;
          
          let foundIdx: number | null = null;
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const dist = Math.sqrt((mouseX - node.x) ** 2 + (mouseY - node.y) ** 2);
            if (dist < 15) {
              foundIdx = i;
              break;
            }
          }
          hoveredNodeIndex = foundIdx;
        };

        const handleClick = (e: MouseEvent) => {
          const rect = canvas.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;
          
          // Check if we clicked on a node pin
          let clickedNodeIdx: number | null = null;
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const dist = Math.sqrt((clickX - node.x) ** 2 + (clickY - node.y) ** 2);
            if (dist < 15) {
              clickedNodeIdx = i;
              break;
            }
          }

          if (clickedNodeIdx !== null) {
            triggerChime();
            if (selectedNodeIndex === null) {
              selectedNodeIndex = clickedNodeIdx;
            } else if (selectedNodeIndex === clickedNodeIdx) {
              selectedNodeIndex = null; // Deselect
            } else {
              // Stitch connection!
              // Avoid duplicates
              const exists = userConnections.some(([a, b]) => 
                (a === selectedNodeIndex && b === clickedNodeIdx) || 
                (a === clickedNodeIdx && b === selectedNodeIndex)
              );
              if (!exists) {
                userConnections.push([selectedNodeIndex, clickedNodeIdx]);
              }
              selectedNodeIndex = clickedNodeIdx; // Continue stitching from new point!
            }
          } else {
            // General ripple
            ripples.push({ x: clickX, y: clickY, r: 4, alpha: 1.0 });
            triggerChime();
          }
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('click', handleClick);
        return () => {
          clearInterval(interval);
          canvas.removeEventListener('mousemove', handleMouseMove);
          canvas.removeEventListener('click', handleClick);
        };
      }
    }
  }, [activeModal, isPlayingSound]);

  return (
    <div 
      ref={containerRef} 
      id="installation_container" 
      className="relative w-full min-h-screen bg-earth text-charcoal noise-overlay select-none overflow-y-auto overflow-x-hidden"
      style={{ scrollBehavior: 'smooth' }}
    >
      
      {/* 1. IMMERSIVE CUSTOM CURSOR (Gusta Studio style: expanded circle containing context text, positioned at z-[9999] for modal visibility) */}
      <div 
        ref={cursorRef} 
        id="custom_cursor"
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <div className={`rounded-full border border-charcoal/30 flex items-center justify-center transition-all duration-500 ease-out ${isCursorHovered ? 'w-24 h-24 bg-charcoal/5 border-charcoal scale-110' : 'w-5 h-5 bg-charcoal/10'}`}>
          {isCursorHovered ? (
            <span className="font-display font-bold text-[8px] tracking-[0.2em] text-charcoal uppercase text-center leading-none px-2 select-none">
              {cursorLabel || 'Ver más'}
            </span>
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-charcoal" />
          )}
        </div>
      </div>

      {/* 2. ARTISTIC PERSISTENT HEADER (Gusta Studio minimalist grid alignment, light theme optimized) */}
      <header id="persistent_header" className="fixed top-0 left-0 z-40 w-full px-6 py-4 md:px-12 md:py-5 flex justify-between items-center bg-earth/90 backdrop-blur-md border-b border-charcoal/5 select-none">
        <div className="flex flex-col">
          <span className="font-display font-extrabold tracking-[-0.03em] uppercase text-lg md:text-xl text-charcoal hover:opacity-75 transition-opacity duration-300">
            Antes del nombre
          </span>
          <span className="font-mono text-[8px] tracking-[0.25em] text-charcoal/50 uppercase mt-0.5">
            Ensayo Genealógico Interactivo / Uruguay
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {/* Ambient Sound Toggle */}
          <button 
            id="sound_toggle_btn"
            onClick={handleToggleSound}
            onMouseEnter={() => { setIsCursorHovered(true); setCursorLabel(isPlayingSound ? 'Silenciar' : 'Sonido'); }}
            onMouseLeave={() => { setIsCursorHovered(false); setCursorLabel(null); }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-charcoal/10 bg-parchment/50 backdrop-blur-sm text-xs font-mono tracking-wider transition-all hover:bg-charcoal hover:text-earth cursor-none"
          >
            {isPlayingSound ? (
              <>
                <Volume2 size={11} className="text-charcoal animate-pulse" />
                <span className="text-[9px] tracking-widest font-bold text-charcoal">ATMÓSFERA ON</span>
              </>
            ) : (
              <>
                <VolumeX size={11} className="text-charcoal/40" />
                <span className="text-[9px] tracking-widest text-charcoal/40 font-bold">MUTED</span>
              </>
            )}
          </button>

          {/* Project conceptual details button */}
          <button 
            id="concept_details_btn"
            onClick={() => { triggerChime(); setInfoOpen(!infoOpen); }}
            onMouseEnter={() => { setIsCursorHovered(true); setCursorLabel(infoOpen ? 'Cerrar' : 'Concepto'); }}
            onMouseLeave={() => { setIsCursorHovered(false); setCursorLabel(null); }}
            className="w-9 h-9 rounded-full border border-charcoal/10 bg-parchment/50 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-charcoal hover:text-earth cursor-none"
          >
            <Info size={12} className="text-charcoal" />
          </button>
        </div>
      </header>

      {/* 3. VERTICAL RED THREAD SVG OVERLAY (Decolonial Stitch tracing down the layout) */}
      <svg 
        id="vertical_thread_overlay"
        ref={threadSvgRef}
        className="absolute top-0 left-0 pointer-events-none z-10 w-full h-full"
        style={{ minHeight: '650vh' }}
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M 500,200 
             C 800,450 950,650 780,950 
             C 600,1250 120,1400 220,1750 
             C 320,2050 880,2250 820,2700 
             C 760,3150 180,3250 320,3650 
             C 480,4050 920,4350 720,4750 
             C 520,5150 280,5450 420,5850 
             C 580,6250 480,6350 500,6550"
          fill="none"
          stroke="#a72d2d"
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-70 filter drop-shadow-[0_0_6px_rgba(167,45,45,0.7)]"
        />
      </svg>

      {/* 4. POETIC INITIAL INTRO BOX (Light theme & Gusta Studio rounding optimized) */}
      {!isIntroDismissed && (
        <div id="audio_invitation_box" className="fixed inset-0 z-50 flex items-center justify-center bg-earth/95 backdrop-blur-xl p-6 select-none">
          <div className="max-w-md w-full p-8 rounded-2xl border border-charcoal/10 bg-parchment/90 shadow-2xl animate-fade-in duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-charcoal/20" />
            
            <Fingerprint className="mx-auto text-charcoal mb-6 animate-pulse" size={28} />
            <h3 className="font-display font-extrabold tracking-[-0.03em] uppercase text-2xl text-charcoal mb-3 text-center">Antes del nombre</h3>
            <p className="font-serif text-sm text-charcoal/80 text-center leading-relaxed mb-6 px-4">
              "Esta no es una historia familiar de placas de plata. Es un ensayo interactivo sobre el olvido, las cicatrices del territorio y la persistencia biológica de quienes fueron borrados de los archivos oficiales de Uruguay."
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={dismissIntro}
                className="w-full py-4 rounded-full bg-charcoal text-earth font-display tracking-[0.22em] uppercase text-[9px] hover:opacity-90 cursor-none transition-all duration-300 font-bold flex items-center justify-center gap-2"
              >
                <Play size={10} fill="currentColor" />
                Activar sonido y entrar
              </button>
              <button 
                onClick={dismissIntroSilent}
                className="w-full py-3 rounded-full border border-charcoal/20 text-charcoal/60 font-display tracking-[0.18em] uppercase text-[8px] hover:border-charcoal cursor-none transition-all duration-300 font-bold"
              >
                Entrar en silencio
              </button>
            </div>
            <div className="mt-8 pt-5 border-t border-charcoal/10 text-[8px] font-mono tracking-widest text-charcoal/40 text-center uppercase">
              RECOMENDADO: AURICULARES & PANTALLA COMPLETA
            </div>
          </div>
        </div>
      )}

      {/* 5. CONCEPT / DOCUMENTATION PANEL OVERLAY (GLASSMORPHISM, LIGHT OPTIMIZED) */}
      {infoOpen && (
        <div id="info_modal_overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth/90 backdrop-blur-md select-none">
          <div className="max-w-xl w-full max-h-[85vh] overflow-y-auto rounded-2xl border border-charcoal/10 bg-parchment/95 p-8 relative shadow-2xl hide-scrollbar">
            <button 
              onClick={() => { triggerChime(); setInfoOpen(false); }}
              className="absolute top-6 right-6 text-charcoal/40 hover:text-charcoal transition-colors"
            >
              <X size={18} />
            </button>
            
            <div className="flex items-center gap-2 mb-6">
              <Compass className="text-charcoal/60" size={13} />
              <span className="font-mono text-[8px] tracking-[0.2em] text-ochre uppercase">El Archivo Ausente — Bitácora del Ensayo</span>
            </div>

            <h3 className="font-display font-extrabold tracking-[-0.03em] uppercase text-3xl text-charcoal mb-4 leading-[0.9]">
              RECONSTRUIR DESDE LOS RESTOS
            </h3>

            <p className="font-sans text-xs text-charcoal/80 leading-relaxed mb-4">
              Este proyecto nace en respuesta a la deconstrucción del relato hegemónico sobre lo indígena en Uruguay. El desafío consistió en rastrear una genealogía familiar que carece de registros oficiales.
            </p>

            <p className="font-sans text-xs text-charcoal/80 leading-relaxed mb-4">
              <strong>La ausencia de archivo es nuestra textura.</strong> No heredé álbumes familiares de cuero, ni placas fotográficas coloniales. Lo único que sobrevive son restos: relatos fragmentados del lado materno transmitidos en la cocina, partidas desvaídas en juzgados del interior, un árbol de gomero guardando silencio, y una mancha de nacimiento compartida en el cuello.
            </p>

            <blockquote className="border-l-2 border-charcoal/40 pl-4 py-1 font-serif text-charcoal/95 my-6 text-sm">
              "Para quienes no heredamos un archivo, la memoria no es un documento que se lee: es una arcilla rústica que se amasa."
            </blockquote>

            <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-charcoal/10 text-left">
              <div>
                <h4 className="font-mono text-[8px] tracking-[0.2em] text-ochre uppercase mb-1.5">MATERIALIDAD</h4>
                <p className="font-sans text-[10px] text-charcoal/60 leading-relaxed">
                  Hojas de gomero, antotipia, manuscritos, hilos rojos, costuras de campaña, marcas biológicas y cartografías fluviales.
                </p>
              </div>
              <div>
                <h4 className="font-mono text-[8px] tracking-[0.2em] text-ochre uppercase mb-1.5">CONCEPTO</h4>
                <p className="font-sans text-[10px] text-charcoal/60 leading-relaxed">
                  Pieza digital interactiva construida sobre la ausencia como presencia indestructible. Uruguay, 2026.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MAIN VERTICAL FLOW OF SECTIONS */}
      <main className="w-full relative z-20 flex flex-col items-center select-none">

        {/* --------------------------------------------------------------------------------- */}
        {/* SECCIÓN I: INICIO (Antes del nombre - Estilo Universal Sans Display 385) */}
        {/* --------------------------------------------------------------------------------- */}
        <section 
          id="sec_inicio" 
          className="w-full min-h-screen flex flex-col justify-between px-6 py-24 md:px-16 md:py-32 max-w-7xl mx-auto"
        >
          <div className="h-10"></div> {/* Spacer */}
          
          <div className="my-auto">
            <span className="font-mono text-[10px] tracking-[0.35em] text-ochre uppercase block mb-6 animate-pulse">
              [ ENSAYO INTERACTIVO SOBRE LA AUSENCIA ]
            </span>
            
            {/* Massive Display Title - Universal Sans Style */}
            <h1 className="font-display font-extrabold tracking-[-0.05em] uppercase text-6xl sm:text-8xl md:text-[8rem] lg:text-[11rem] xl:text-[13rem] leading-[0.85] text-charcoal mb-4 select-none">
              Antes del<br />
              <span className="font-syne font-extrabold text-ochre tracking-tighter">Nombre.</span>
            </h1>
            
            {/* Required subtext phrase */}
            <p className="font-display font-bold tracking-tight text-xl sm:text-2xl md:text-3xl lg:text-4xl text-charcoal/90 leading-tight max-w-4xl border-l-2 border-charcoal/20 pl-6 my-10">
              Empiezo por mí porque antes de mí hay huecos.
            </p>
            
            {/* Beautiful structured index of the core poetic phrases requested */}
            <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-6 border-t border-b border-charcoal/10 py-10 mt-16 select-none">
              <div 
                className="flex flex-col gap-2 group cursor-none"
                onMouseEnter={() => { setIsCursorHovered(true); setCursorLabel('Persistir'); }}
                onMouseLeave={() => { setIsCursorHovered(false); setCursorLabel(null); }}
              >
                <span className="font-mono text-[8px] text-ochre tracking-widest">[ 01 ]</span>
                <span className="font-display font-extrabold text-[11px] uppercase tracking-wider text-charcoal group-hover:text-ochre transition-colors duration-300">La persistencia</span>
                <p className="font-serif text-xs text-charcoal/60">"Lo que no fue archivado persiste."</p>
              </div>
              
              <div 
                className="flex flex-col gap-2 group cursor-none"
                onMouseEnter={() => { setIsCursorHovered(true); setCursorLabel('La tierra'); }}
                onMouseLeave={() => { setIsCursorHovered(false); setCursorLabel(null); }}
              >
                <span className="font-mono text-[8px] text-ochre tracking-widest">[ 02 ]</span>
                <span className="font-display font-extrabold text-[11px] uppercase tracking-wider text-charcoal group-hover:text-ochre transition-colors duration-300">La memoria vegetal</span>
                <p className="font-serif text-xs text-charcoal/60">"La tierra recuerda antes que el nombre."</p>
              </div>
              
              <div 
                className="flex flex-col gap-2 group cursor-none"
                onMouseEnter={() => { setIsCursorHovered(true); setCursorLabel('El cuerpo'); }}
                onMouseLeave={() => { setIsCursorHovered(false); setCursorLabel(null); }}
              >
                <span className="font-mono text-[8px] text-ochre tracking-widest">[ 03 ]</span>
                <span className="font-display font-extrabold text-[11px] uppercase tracking-wider text-charcoal group-hover:text-ochre transition-colors duration-300">El archivo celular</span>
                <p className="font-serif text-xs text-charcoal/60">"Hay memorias que el cuerpo conserva."</p>
              </div>
              
              <div 
                className="flex flex-col gap-2 group cursor-none"
                onMouseEnter={() => { setIsCursorHovered(true); setCursorLabel('Coser'); }}
                onMouseLeave={() => { setIsCursorHovered(false); setCursorLabel(null); }}
              >
                <span className="font-mono text-[8px] text-ochre tracking-widest">[ 04 ]</span>
                <span className="font-display font-extrabold text-[11px] uppercase tracking-wider text-charcoal group-hover:text-ochre transition-colors duration-300">La sutura</span>
                <p className="font-serif text-xs text-charcoal/60">"Lo roto puede coserse."</p>
              </div>
              
              <div 
                className="flex flex-col gap-2 group cursor-none"
                onMouseEnter={() => { setIsCursorHovered(true); setCursorLabel('Unir'); }}
                onMouseLeave={() => { setIsCursorHovered(false); setCursorLabel(null); }}
              >
                <span className="font-mono text-[8px] text-ochre tracking-widest">[ 05 ]</span>
                <span className="font-display font-extrabold text-[11px] uppercase tracking-wider text-charcoal group-hover:text-ochre transition-colors duration-300">Los fragmentos</span>
                <p className="font-serif text-xs text-charcoal/60">"No heredé un archivo. Heredé fragmentos."</p>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6">
            <div className="max-w-md">
              <p className="font-sans text-[11px] text-charcoal/50 leading-relaxed tracking-wider">
                Desciende verticalmente por el linaje. La costura biológica y el territorio sostienen el vacío donde las actas callaron.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[8px] tracking-[0.2em] text-ochre uppercase">Navegación vertical continua</span>
              <div className="w-16 h-[1px] bg-ochre/35 animate-pulse" />
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------------------------------- */}
        {/* SECCIÓN II: EL ARCHIVO VEGETAL (Primera Hoja) */}
               <section 
          id="sec_archivo_vegetal" 
          className="fade-section w-full min-h-screen flex flex-col justify-center px-6 py-20 md:px-16 max-w-7xl mx-auto relative select-none"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-8 h-[1px] bg-charcoal/20" />
                <span className="font-mono text-[9px] tracking-[0.3em] text-ochre uppercase">MÓDULO I / REGISTRO_01</span>
              </div>
              <h2 className="font-display font-extrabold tracking-[-0.03em] uppercase text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[0.95] mb-6 text-charcoal">
                EL ARCHIVO<br />VEGETAL.
              </h2>
              <p className="font-sans text-xs md:text-sm leading-relaxed text-charcoal/85 mb-8 max-w-md">
                El gomero de mi patio de la infancia no fue una simple planta de adorno: fue un testigo biológico custodio del silencio familiar. Sus hojas carnosas actúan hoy como placas fotosensibles de revelado vegetal, sustituyendo al papel que nunca heredamos.
              </p>
              
              <div>
                <button 
                  onClick={() => openHotspotModal('manifiesto')}
                  onMouseEnter={() => { setIsCursorHovered(true); setCursorLabel('Manifiesto'); }}
                  onMouseLeave={() => { setIsCursorHovered(false); setCursorLabel(null); }}
                  className="px-6 py-3 rounded-full border border-charcoal/20 bg-parchment hover:bg-charcoal hover:text-earth text-[9px] font-display uppercase tracking-[0.2em] font-bold cursor-none transition-all duration-300 flex items-center gap-2"
                >
                  <span>Abrir manifiesto</span>
                  <ChevronRight size={10} />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 flex justify-center items-center order-1 lg:order-2">
              <div className="leaf-parallax-1 relative w-full max-w-sm aspect-[3/4] group transition-all duration-500">
                {/* Rotated leaf mask */}
                <div 
                  className="w-full h-full relative overflow-hidden shadow-[10px_10px_35px_rgba(0,0,0,0.06)] border border-charcoal/5"
                  style={{ borderRadius: "0% 100% 0% 100%", transform: "rotate(45deg) scale(0.95)" }}
                >
                  <img 
                    src={leafChildhood} 
                    alt="Hoja de gomero con retrato infantil impreso como antotipia" 
                    className="w-full h-full object-cover grayscale-[15%] group-hover:scale-105 transition-transform duration-1000 ease-out"
                    style={{ transform: "rotate(-45deg) scale(1.4)" }}
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle vignette layer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/15 via-transparent to-transparent pointer-events-none" />
                </div>
                
                {/* Glowing Hotspot Button positioned in center of the leaf, unrotated */}
                <button
                  onClick={() => openHotspotModal('manifiesto')}
                  onMouseEnter={() => { setIsCursorHovered(true); setCursorLabel('Tocar'); }}
                  onMouseLeave={() => { setIsCursorHovered(false); setCursorLabel(null); }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-charcoal text-earth font-mono text-lg cursor-none hotspot-pulse flex items-center justify-center border border-earth/25 active:scale-95 transition-transform z-10"
                >
                  +
                </button>

                {/* Archival precise labels */}
                <div className="absolute -bottom-6 right-3 bg-parchment px-3 py-1 border border-charcoal/10 rounded-full font-mono text-[7px] tracking-[0.18em] text-ochre uppercase shadow-md z-10">
                  TECNOLOGÍA: ANTOTIPIA / CLOROTIPIA (FICUS ELASTICA)
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --------------------------------------------------------------------------------- */}
        {/* SECCIÓN III: EL REVELADO QUÍMICO (Sleek Crossfade linked to ScrollTrigger) */}
        {/* --------------------------------------------------------------------------------- */}
        <section 
          id="sec_revelado" 
          className="fade-section w-full min-h-screen flex flex-col justify-center px-6 py-20 md:px-16 max-w-7xl mx-auto select-none"
        >
          <div className="w-full text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-[8px] tracking-[0.35em] text-ochre uppercase block mb-4">REACCIONES DE LA MEMORIA</span>
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-charcoal/90 leading-relaxed">
              "La memoria es un reactivo químico. Dos capas de historia conviven un instante antes de disolverse."
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 flex justify-center relative">
              <div className="leaf-parallax-1 relative w-full max-w-sm aspect-[3/4] group transition-all duration-500">
                {/* Rotated leaf mask */}
                <div 
                  className="w-full h-full relative overflow-hidden shadow-[10px_10px_35px_rgba(0,0,0,0.06)] border border-charcoal/5"
                  style={{ borderRadius: "0% 100% 0% 100%", transform: "rotate(45deg) scale(0.95)" }}
                >
                  {/* Original childhood face leaf */}
                  <img 
                    src={leafChildhood} 
                    alt="Retrato infantil original en la hoja" 
                    className="absolute inset-0 w-full h-full object-cover grayscale-[25%] opacity-90"
                    style={{ transform: "rotate(-45deg) scale(1.4)" }}
                    referrerPolicy="no-referrer"
                  />

                  {/* Cursive manuscript leaf overlaying on scroll */}
                  <img 
                    src={leafSecond} 
                    alt="Manuscrito que se revela" 
                    className="chemical-overlay absolute inset-0 w-full h-full object-cover opacity-0 mix-blend-multiply"
                    style={{ transform: "rotate(-45deg) scale(1.4)" }}
                    referrerPolicy="no-referrer"
                  />

                  {/* Delicate gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/15 to-transparent pointer-events-none" />
                </div>
                
                {/* Tech tag positioned cleanly outside leaf overlay */}
                <div className="absolute -bottom-6 left-3 bg-parchment border border-charcoal/10 px-3 py-1 rounded-full text-[7px] font-mono tracking-widest text-ochre uppercase flex items-center gap-2 shadow-md">
                  <Sparkles size={9} className="text-ochre animate-spin" />
                  <span>TRANSICIÓN QUÍMICA ACTIVA</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="font-mono text-[8px] tracking-[0.2em] text-ochre uppercase mb-3 block">[ EL REVELADO VERTICAL ]</span>
              <h3 className="font-serif text-3xl text-charcoal mb-5 leading-tight">La convivencia de dos tiempos</h3>
              <p className="font-sans text-xs md:text-sm leading-relaxed text-charcoal/70 mb-8">
                A medida que te desplazas verticalmente por la página, el retrato infantil impreso se diluye orgánicamente sobre el tejido celular de la planta, dando paso a las caligrafías manuscritas del siglo XIX de juzgados coloniales del interior de Uruguay. La naturaleza asume la custodia del documento ausente.
              </p>
              
              <div className="p-5 border-l-2 border-charcoal/30 bg-parchment/60 rounded-xl">
                <p className="font-mono text-[9px] tracking-widest text-charcoal/50 uppercase mb-1.5">PERSISTENCIA DE LOS RESTOS</p>
                <p className="font-sans text-[11px] text-charcoal/70 leading-relaxed">
                  Dado que el relato oficial uruguayo invisibilizó a las comunidades indígenas, la reconstrucción requiere amalgamar la biología viva con los jirones del papel que sobrevivieron.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* --------------------------------------------------------------------------------- */}
        {/* SECCIÓN IV: LA PALABRA / LA MEMORIA ORAL (Segunda Hoja) */}
        {/* --------------------------------------------------------------------------------- */}
        <section 
          id="sec_transmision" 
          className="fade-section w-full min-h-screen flex flex-col justify-center px-6 py-20 md:px-16 max-w-7xl mx-auto select-none"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 flex justify-center items-center order-2 lg:order-1">
              <div className="leaf-parallax-2 relative w-full max-w-sm aspect-[3/4] group transition-all duration-500">
                {/* Rotated leaf mask */}
                <div 
                  className="w-full h-full relative overflow-hidden shadow-[10px_10px_35px_rgba(0,0,0,0.06)] border border-charcoal/5"
                  style={{ borderRadius: "0% 100% 0% 100%", transform: "rotate(45deg) scale(0.95)" }}
                >
                  <img 
                    src={leafSecond} 
                    alt="Hojas del archivo vegetal impresas con letras de partidas manuscritas antiguas" 
                    className="w-full h-full object-cover grayscale-[10%] group-hover:scale-105 transition-transform duration-1000 ease-out"
                    style={{ transform: "rotate(-45deg) scale(1.4)" }}
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/15 via-transparent to-transparent pointer-events-none" />
                </div>
                
                {/* Glowing Hotspot Button positioned in center of the leaf, unrotated */}
                <button
                  onClick={() => openHotspotModal('archivo')}
                  onMouseEnter={() => { setIsCursorHovered(true); setCursorLabel('Escuchar'); }}
                  onMouseLeave={() => { setIsCursorHovered(false); setCursorLabel(null); }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-charcoal text-earth font-mono text-lg cursor-none hotspot-pulse flex items-center justify-center border border-earth/25 active:scale-95 transition-transform z-10"
                >
                  +
                </button>

                <div className="absolute -bottom-6 left-3 bg-parchment px-3 py-1 border border-charcoal/10 rounded-full font-mono text-[7px] tracking-[0.18em] text-ochre uppercase shadow-md z-10">
                  MANUSCRITO: REGISTRO PARROQUIAL DE FRONTERA
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center order-1 lg:order-2">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-8 h-[1px] bg-charcoal/20" />
                <span className="font-mono text-[9px] tracking-[0.3em] text-ochre uppercase">MÓDULO II / REGISTRO_02</span>
              </div>
              <h2 className="font-display font-extrabold tracking-[-0.03em] uppercase text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[0.95] mb-6 text-charcoal">
                LA PALABRA<br />SUSURRADA.
              </h2>
              <p className="font-sans text-xs md:text-sm leading-relaxed text-charcoal/85 mb-8 max-w-md">
                Donde el Estado trazó actas oficiales que declararon extinto un linaje, la memoria de mi sangre indígena persiste refugiada en los murmullos de cocina de mi madre y mi abuela. Relatos susurrados sobre hojas curativas y orígenes fluviales, transmitidos en el calor del café.
              </p>
              
              <div>
                <button 
                  onClick={() => openHotspotModal('archivo')}
                  onMouseEnter={() => { setIsCursorHovered(true); setCursorLabel('Archivos'); }}
                  onMouseLeave={() => { setIsCursorHovered(false); setCursorLabel(null); }}
                  className="px-6 py-3 rounded-full border border-charcoal/20 bg-parchment hover:bg-charcoal hover:text-earth text-[9px] font-display uppercase tracking-[0.2em] font-bold cursor-none transition-all duration-300 flex items-center gap-2"
                >
                  <span>Escuchar fragmentos</span>
                  <ChevronRight size={10} />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* --------------------------------------------------------------------------------- */}
        {/* SECCIÓN V: EL ARCHIVO DE LA PIEL (Tercera Hoja) */}
        {/* --------------------------------------------------------------------------------- */}
        <section 
          id="sec_marcas" 
          className="fade-section w-full min-h-screen flex flex-col justify-center px-6 py-20 md:px-16 max-w-7xl mx-auto select-none"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-8 h-[1px] bg-charcoal/20" />
                <span className="font-mono text-[9px] tracking-[0.3em] text-ochre uppercase">MÓDULO III / REGISTRO_03</span>
              </div>
              <h2 className="font-display font-extrabold tracking-[-0.03em] uppercase text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[0.95] mb-6 text-charcoal">
                EL ARCHIVO<br />DE LA PIEL.
              </h2>
              <p className="font-sans text-xs md:text-sm leading-relaxed text-charcoal/85 mb-8 max-w-md">
                Una mancha arcillosa en la base del cuello, compartida de forma idéntica por mi madre, mi hermano y yo. Esta pigmentación persistente constituye nuestra partida de filiación biológica incontestable. El cuerpo deviene archivo indestructible contra el olvido.
              </p>
              
              <div>
                <button 
                  onClick={() => openHotspotModal('marcas')}
                  onMouseEnter={() => { setIsCursorHovered(true); setCursorLabel('Piel'); }}
                  onMouseLeave={() => { setIsCursorHovered(false); setCursorLabel(null); }}
                  className="px-6 py-3 rounded-full border border-charcoal/20 bg-parchment hover:bg-charcoal hover:text-earth text-[9px] font-display uppercase tracking-[0.2em] font-bold cursor-none transition-all duration-300 flex items-center gap-2"
                >
                  <span>Reconocer marcas</span>
                  <ChevronRight size={10} />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 flex justify-center items-center">
              <div className="leaf-parallax-3 relative w-full max-w-sm aspect-[3/4] group transition-all duration-500">
                {/* Rotated leaf mask */}
                <div 
                  className="w-full h-full relative overflow-hidden shadow-[10px_10px_35px_rgba(0,0,0,0.06)] border border-charcoal/5"
                  style={{ borderRadius: "0% 100% 0% 100%", transform: "rotate(45deg) scale(0.95)" }}
                >
                  <img 
                    src={leafThird} 
                    alt="Hoja manchada con barro y arcilla representando la marca biológica" 
                    className="w-full h-full object-cover grayscale-[5%] group-hover:scale-105 transition-transform duration-1000 ease-out"
                    style={{ transform: "rotate(-45deg) scale(1.4)" }}
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/15 via-transparent to-transparent pointer-events-none" />
                </div>
                
                {/* Glowing Hotspot Button positioned in center of the leaf, unrotated */}
                <button
                  onClick={() => openHotspotModal('marcas')}
                  onMouseEnter={() => { setIsCursorHovered(true); setCursorLabel('Sentir'); }}
                  onMouseLeave={() => { setIsCursorHovered(false); setCursorLabel(null); }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-charcoal text-earth font-mono text-lg cursor-none hotspot-pulse flex items-center justify-center border border-earth/25 active:scale-95 transition-transform z-10"
                >
                  +
                </button>

                <div className="absolute -bottom-6 right-3 bg-parchment px-3 py-1 border border-charcoal/10 rounded-full font-mono text-[7px] tracking-[0.18em] text-ochre uppercase shadow-md z-10">
                  REGISTRO: MARCADO BIOLÓGICO TRANSMITIDO
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --------------------------------------------------------------------------------- */}
        {/* SECCIÓN VI: EL TERRITORIO (Mapa de Uruguay) */}
        {/* --------------------------------------------------------------------------------- */}
        <section 
          id="sec_territorio" 
          className="fade-section w-full min-h-screen flex flex-col justify-center px-6 py-20 md:px-16 max-w-7xl mx-auto select-none"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 flex justify-center items-center order-2 lg:order-1">
              <div className="map-parallax relative w-full max-w-md aspect-[3/4] rounded-2xl border border-charcoal/5 bg-parchment p-3 shadow-[10px_10px_35px_rgba(0,0,0,0.06)] group transition-all duration-500">
                <div className="w-full h-full relative overflow-hidden rounded-xl">
                  <img 
                    src={mapEmbroidered} 
                    alt="Mapa de Uruguay bordado con hilos rojos" 
                    className="w-full h-full object-cover grayscale-[12%] group-hover:scale-105 transition-transform duration-1000 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Glowing Hotspot Button */}
                  <button
                    onClick={() => openHotspotModal('territorio')}
                    onMouseEnter={() => { setIsCursorHovered(true); setCursorLabel('Bordar'); }}
                    onMouseLeave={() => { setIsCursorHovered(false); setCursorLabel(null); }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-charcoal text-earth font-mono text-lg cursor-none hotspot-pulse flex items-center justify-center border border-earth/25 active:scale-95 transition-transform z-10"
                  >
                    +
                  </button>
                </div>

                <div className="absolute -bottom-6 left-3 bg-parchment px-3 py-1 border border-charcoal/10 rounded-full font-mono text-[7px] tracking-[0.18em] text-ochre uppercase shadow-md z-10">
                  CARTOGRAFÍA: HILOS FLUVIALES DE LA CAMPAÑA
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center order-1 lg:order-2">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-8 h-[1px] bg-charcoal/20" />
                <span className="font-mono text-[9px] tracking-[0.3em] text-ochre uppercase">MÓDULO IV / REGISTRO_04</span>
              </div>
              <h2 className="font-display font-extrabold tracking-[-0.03em] uppercase text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[0.95] mb-6 text-charcoal">
                GEOGRAFÍA<br />BORDADA.
              </h2>
              <p className="font-sans text-xs md:text-sm leading-relaxed text-charcoal/85 mb-8 max-w-md">
                Bordar la geografía uruguaya con hilos rojos es un acto de soberanía íntima. No trazo fronteras políticas departamentales decretadas tras el genocidio de Salsipuedes: coso arroyos, cursos de agua pura y caminos de escape. Las costuras son cicatrices fluviales del territorio.
              </p>
              
              <div>
                <button 
                  onClick={() => openHotspotModal('territorio')}
                  onMouseEnter={() => { setIsCursorHovered(true); setCursorLabel('Territorio'); }}
                  onMouseLeave={() => { setIsCursorHovered(false); setCursorLabel(null); }}
                  className="px-6 py-3 rounded-full border border-charcoal/20 bg-parchment hover:bg-charcoal hover:text-earth text-[9px] font-display uppercase tracking-[0.2em] font-bold cursor-none transition-all duration-300 flex items-center gap-2"
                >
                  <span>Coser el mapa</span>
                  <ChevronRight size={10} />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* --------------------------------------------------------------------------------- */}
        {/* SECCIÓN VII: POÉTICA FINAL / CATALOGO DE RESTOS */}
        {/* --------------------------------------------------------------------------------- */}
        <section 
          id="sec_final" 
          className="fade-section w-full min-h-screen flex flex-col justify-between px-6 py-24 md:px-16 max-w-5xl mx-auto text-center select-none"
        >
          <div className="h-10"></div>

          <div className="my-auto flex flex-col gap-10 max-w-3xl mx-auto">
            <span className="font-mono text-[9px] tracking-[0.35em] text-ochre uppercase">SUMATORIA DE AUSENCIAS</span>
            
            <h2 className="font-display font-extrabold tracking-[-0.03em] uppercase text-4xl sm:text-5xl md:text-6xl text-charcoal leading-[0.95] mb-4">
              LO QUE NO FUE ARCHIVADO PERSISTE.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mt-8 select-none">
              <div className="p-6 rounded-2xl border border-charcoal/10 bg-parchment shadow-sm">
                <span className="font-mono text-[8px] text-ochre block mb-3 font-bold">[ SENTENCIA_01 ]</span>
                <p className="font-sans text-xs text-charcoal/75 leading-relaxed">
                  <strong>"La tierra recuerda antes que el nombre."</strong> Si el fuego consumió la filiación de papel, la savia viva de las hojas oscuras asume el testimonio.
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-charcoal/10 bg-parchment shadow-sm">
                <span className="font-mono text-[8px] text-ochre block mb-3 font-bold">[ SENTENCIA_02 ]</span>
                <p className="font-sans text-xs text-charcoal/75 leading-relaxed">
                  <strong>"Hay memorias que el cuerpo conserva."</strong> Nuestra mancha compartida es un sello celular indestructible que protesta contra el borrado oficial.
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-charcoal/10 bg-parchment shadow-sm">
                <span className="font-mono text-[8px] text-ochre block mb-3 font-bold">[ SENTENCIA_03 ]</span>
                <p className="font-sans text-xs text-charcoal/75 leading-relaxed">
                  <strong>"No heredé un archivo. Heredé fragmentos."</strong> Hilvanar las ausencias para tejer una soberanía de las raíces flotantes.
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-charcoal/10 bg-parchment shadow-sm">
                <span className="font-mono text-[8px] text-ochre block mb-3 font-bold">[ SENTENCIA_04 ]</span>
                <p className="font-sans text-xs text-charcoal/75 leading-relaxed">
                  <strong>"Lo roto puede coserse."</strong> Agujerear la tela, remendar la costura fluvial y remapear la pertenencia de nuestro territorio.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-charcoal/10 text-center flex flex-col items-center gap-4">
            <div className="flex gap-2.5 items-center">
              <div className="w-2 h-2 rounded-full bg-ochre animate-ping" />
              <span className="font-mono text-[8px] tracking-[0.3em] text-ochre uppercase">FIN DE LA INSTALACIÓN DIGITAL</span>
            </div>
            <button 
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); triggerChime(); }}
              onMouseEnter={() => { setIsCursorHovered(true); setCursorLabel('Reiniciar'); }}
              onMouseLeave={() => { setIsCursorHovered(false); setCursorLabel(null); }}
              className="text-[9px] font-display font-bold tracking-[0.25em] text-charcoal/40 hover:text-charcoal transition-colors duration-300 cursor-none"
            >
              Reiniciar el hilo ↑
            </button>
          </div>
        </section>

      </main>

      {/* 7. HIGH-FIDELITY POPUP MODAL (Con canva interactiva) */}
      {activeModal && (
        <div id="hotspot_modal_overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-md select-none">
          <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-charcoal/10 bg-parchment shadow-[20px_20px_60px_rgba(0,0,0,0.12)] relative p-8 hide-scrollbar">
            
            <button 
              onClick={closeModal}
              onMouseEnter={() => { setIsCursorHovered(true); setCursorLabel('Cerrar'); }}
              onMouseLeave={() => { setIsCursorHovered(false); setCursorLabel(null); }}
              className="absolute top-6 right-6 text-charcoal/40 hover:text-charcoal transition-colors cursor-none"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="text-ochre" size={13} />
              <span className="font-mono text-[8px] tracking-[0.2em] text-ochre uppercase">{activeModal.metadata}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              
              {/* Left Column: Text narrative */}
              <div>
                <h3 className="font-display font-extrabold tracking-[-0.03em] uppercase text-3xl text-charcoal mb-2 leading-none">
                  {activeModal.title}
                </h3>
                <h4 className="font-mono text-[8px] tracking-[0.2em] text-ochre uppercase mb-5">
                  {activeModal.subtitle}
                </h4>

                <p className="font-serif text-sm text-charcoal/90 mb-5 border-l-2 border-ochre/40 pl-4 py-1 leading-relaxed">
                  {activeModal.quote}
                </p>

                <p className="font-sans text-[11px] leading-relaxed text-charcoal/70">
                  {activeModal.narrative}
                </p>
              </div>

              {/* Right Column: Dynamic Interactive Sandbox */}
              <div className="flex flex-col items-center">
                <span className="font-mono text-[8px] tracking-[0.2em] text-charcoal/45 uppercase mb-4 block">
                  INTERACCIÓN ACTIVA CON EL REGISTRO
                </span>

                {/* INTERACTIVE COMPONENT 1: BREATHING VEGETAL MANIFESTO */}
                {activeModal.interactiveType === 'breathing' && (
                  <div className="w-full aspect-square rounded-2xl border border-charcoal/10 bg-[#f0ece3] flex flex-col justify-center items-center p-6 text-center relative overflow-hidden shadow-inner">
                    <div className="w-24 h-24 rounded-full border border-ochre/20 flex items-center justify-center animate-[ping_4s_infinite] absolute" />
                    <div className="w-16 h-16 rounded-full border border-ochre/10 flex items-center justify-center animate-[pulse_3s_infinite] absolute" />
                    <div className="w-8 h-8 rounded-full bg-ochre/5 absolute" />
                    
                    <span className="font-mono text-[8px] tracking-[0.22em] text-charcoal/70 uppercase animate-[pulse_2s_infinite] relative z-10">
                      SINCRONIZA TU RESPIRACIÓN...
                    </span>
                    <span className="font-serif text-xs text-charcoal/50 mt-14 relative z-10">
                      "Inhala el silencio, exhala la savia."
                    </span>
                  </div>
                )}

                {/* INTERACTIVE COMPONENT 2: SCRATCH OFF MEMORY MANUSCRIPT */}
                {activeModal.interactiveType === 'scratch' && (
                  <div className="w-full relative aspect-square rounded-2xl border border-charcoal/10 overflow-hidden shadow-inner">
                    {/* Underlying cursive texture */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center filter sepia opacity-80" 
                      style={{ backgroundImage: `url(${leafSecond})` }} 
                    />
                    {/* Hidden written transcription */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center bg-parchment/80 select-text">
                      <span className="font-mono text-[8px] text-ochre tracking-widest uppercase mb-3">VOCES EXTRAS</span>
                      <p className="font-serif text-xs text-charcoal leading-relaxed">
                        "...mientras colaba café en la cocina de barro, mi abuela me miraba el pelo oscuro. Me decía que el agua del río Uruguay nos trajo de allá arriba, donde no hay actas oficiales."
                      </p>
                    </div>
                    {/* Scratch canvas */}
                    <canvas 
                      ref={scratchCanvasRef} 
                      className="absolute inset-0 w-full h-full cursor-crosshair relative z-20" 
                    />
                  </div>
                )}

                {/* INTERACTIVE COMPONENT 3: PHYSICAL MARK DRAW */}
                {activeModal.interactiveType === 'birthmark' && (
                  <div className="w-full relative aspect-square rounded-2xl border border-charcoal/10 overflow-hidden bg-[#f0ece3] shadow-inner">
                    <div className="absolute inset-0 bg-radial-at-c from-[#f0ece3]/10 to-[#f0ece3] pointer-events-none" />
                    <div className="absolute top-4 left-4 pointer-events-none z-10">
                      <span className="font-mono text-[8px] text-charcoal/40 tracking-widest uppercase block">
                        DIBUJA SOBRE LA PIEL PARA DEJAR REGISTRO
                      </span>
                    </div>
                    <canvas 
                      ref={birthmarkCanvasRef} 
                      className="absolute inset-0 w-full h-full cursor-crosshair" 
                    />
                    <div className="absolute bottom-4 text-center pointer-events-none w-full text-[7px] font-mono tracking-widest text-ochre uppercase">
                      Crea la pigmentación celular deslizando el cursor
                    </div>
                  </div>
                )}

                {/* INTERACTIVE COMPONENT 4: RIVER NETWORK RIPPLER */}
                {activeModal.interactiveType === 'rivers' && (
                  <div className="w-full relative aspect-square rounded-2xl border border-charcoal/10 overflow-hidden bg-[#f0ece3] shadow-inner">
                    <div className="absolute top-4 left-4 pointer-events-none z-10">
                      <span className="font-mono text-[8px] text-charcoal/40 tracking-widest uppercase block">
                        COSE EL MAPA HACIENDO CLIC EN LOS PINS PARA UNIRLOS
                      </span>
                    </div>
                    <canvas 
                      ref={riversCanvasRef} 
                      className="absolute inset-0 w-full h-full cursor-pointer" 
                    />
                    <div className="absolute bottom-4 text-center pointer-events-none w-full text-[7px] font-mono tracking-widest text-ochre uppercase px-4">
                      Toca un pin y luego otro para bordar la costura de los ríos reales
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
