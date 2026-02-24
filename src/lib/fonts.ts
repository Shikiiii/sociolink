import { 
  Inter, 
  Roboto, 
  Playfair_Display, 
  Poppins, 
  Lora,
  Oswald,
  Montserrat,
  Merriweather,
  Inconsolata,
  Lobster,
  Pacifico,
  Fredoka,
  Dancing_Script,
  Bangers
} from 'next/font/google';

const inter = Inter({ subsets: ['latin', 'latin-ext'], display: 'swap' });
const roboto = Roboto({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '700'], display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin', 'latin-ext'], display: 'swap' });
const poppins = Poppins({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], display: 'swap' });
const lora = Lora({ subsets: ['latin', 'latin-ext'], display: 'swap' });
const oswald = Oswald({ subsets: ['latin', 'latin-ext'], display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin', 'latin-ext'], display: 'swap' });
const merriweather = Merriweather({ subsets: ['latin', 'latin-ext'], weight: ['300', '400', '700'], display: 'swap' });
const inconsolata = Inconsolata({ subsets: ['latin', 'latin-ext'], display: 'swap' });
const lobster = Lobster({ subsets: ['latin', 'latin-ext'], weight: ['400'], display: 'swap' });
const pacifico = Pacifico({ subsets: ['latin', 'latin-ext'], weight: ['400'], display: 'swap' });
const fredoka = Fredoka({ subsets: ['latin', 'latin-ext'], display: 'swap' });
const dancingScript = Dancing_Script({ subsets: ['latin', 'latin-ext'], display: 'swap' });
const bangers = Bangers({ subsets: ['latin', 'latin-ext'], weight: ['400'], display: 'swap' });

export const fontMap: Record<string, string> = {
  inter: inter.className,
  roboto: roboto.className,
  playfair: playfair.className,
  poppins: poppins.className,
  lora: lora.className,
  oswald: oswald.className,
  montserrat: montserrat.className,
  merriweather: merriweather.className,
  inconsolata: inconsolata.className,
  lobster: lobster.className,
  pacifico: pacifico.className,
  fredoka: fredoka.className,
  dancing_script: dancingScript.className,
  bangers: bangers.className,
};

export const fontOptions = [
  // Sans Serif
  { label: 'Inter', value: 'inter', className: inter.className },
  { label: 'Roboto', value: 'roboto', className: roboto.className },
  { label: 'Poppins', value: 'poppins', className: poppins.className },
  { label: 'Montserrat', value: 'montserrat', className: montserrat.className },
  { label: 'Oswald', value: 'oswald', className: oswald.className },
  
  // Serif
  { label: 'Playfair Display', value: 'playfair', className: playfair.className },
  { label: 'Lora', value: 'lora', className: lora.className },
  { label: 'Merriweather', value: 'merriweather', className: merriweather.className },
  
  // Mono
  { label: 'Inconsolata', value: 'inconsolata', className: inconsolata.className },
  
  // Display / Playful
  { label: 'Fredoka', value: 'fredoka', className: fredoka.className },
  { label: 'Lobster', value: 'lobster', className: lobster.className },
  { label: 'Pacifico', value: 'pacifico', className: pacifico.className },
  { label: 'Dancing Script', value: 'dancing_script', className: dancingScript.className },
  { label: 'Bangers', value: 'bangers', className: bangers.className },
];
