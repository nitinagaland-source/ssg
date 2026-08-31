import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import RotatingGlobe from './components/RotatingGlobe';
import { 
  Newspaper, 
  Award, 
  Globe, 
  Mail, 
  Linkedin, 
  Twitter, 
  ChevronRight, 
  Menu, 
  X,
  ExternalLink,
  BookOpen,
  Users,
  Calendar
} from 'lucide-react';

const NavDropdown = ({ item }: { item: any }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, rotateX: -15, transformPerspective: 1000 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, y: 10, rotateX: -15 }}
      className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50 pointer-events-auto"
    >
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 p-6 min-w-[320px] overflow-hidden relative group">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em]">Data_Stream::{item.name}</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-sky-500 animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-sky-500/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {item.subData.map((data: any, idx: number) => (
              <div key={idx} className="p-3 bg-gray-50/50 rounded-xl border border-gray-100/50 hover:bg-white transition-colors group/item">
                <div className="flex items-center gap-2 mb-1">
                  {data.icon}
                  <span className="text-[9px] font-mono text-gray-400 uppercase">{data.label}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-lg font-anton leading-none text-gray-900">{data.value}</span>
                  {data.trend && (
                    <span className={`text-[8px] font-bold ${data.trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {data.trend > 0 ? '+' : ''}{data.trend}%
                    </span>
                  )}
                </div>
                <div className="mt-2 h-[2px] w-full bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.random() * 60 + 40}%` }}
                    className="h-full bg-sky-500"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <div className="flex gap-2">
              <div className="px-2 py-1 bg-black text-white text-[8px] font-mono rounded uppercase tracking-tighter">Status: Optimal</div>
              <div className="px-2 py-1 bg-gray-100 text-gray-500 text-[8px] font-mono rounded uppercase tracking-tighter">v3.1.0</div>
            </div>
            <ChevronRight size={12} className="text-gray-300" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { 
      name: 'Home', 
      href: '#home',
      subData: [
        { label: 'Uptime', value: '99.9%', icon: <Globe size={10} />, trend: 0.1 },
        { label: 'Latency', value: '24ms', icon: <Calendar size={10} />, trend: -12 },
        { label: 'Nodes', value: '12', icon: <Users size={10} /> },
        { label: 'Security', value: 'SSL_A+', icon: <Award size={10} /> }
      ]
    },
    { 
      name: 'About', 
      href: '#about',
      subData: [
        { label: 'Articles', value: '5.2k', icon: <Newspaper size={10} />, trend: 4 },
        { label: 'Awards', value: '12', icon: <Award size={10} /> },
        { label: 'Years', value: '30+', icon: <Calendar size={10} /> },
        { label: 'Impact', value: 'High', icon: <Globe size={10} /> }
      ]
    },
    { 
      name: 'Experience', 
      href: '#experience',
      subData: [
        { label: 'Role_ID', value: 'EIC_01', icon: <Users size={10} /> },
        { label: 'Projects', value: '142', icon: <BookOpen size={10} />, trend: 8 },
        { label: 'Network', value: 'Global', icon: <Globe size={10} /> },
        { label: 'Rank', value: '#1', icon: <Award size={10} /> }
      ]
    },
    { 
      name: 'Editorial', 
      href: '#editorial',
      subData: [
        { label: 'Reach', value: '100k', icon: <Users size={10} />, trend: 15 },
        { label: 'Growth', value: '45%', icon: <Globe size={10} />, trend: 12 },
        { label: 'Digital', value: 'Live', icon: <Newspaper size={10} /> },
        { label: 'Archived', value: '12k', icon: <BookOpen size={10} /> }
      ]
    },
    { 
      name: 'Contact', 
      href: '#contact',
      subData: [
        { label: 'Response', value: '<2h', icon: <Mail size={10} />, trend: -20 },
        { label: 'Channels', value: '04', icon: <Linkedin size={10} /> },
        { label: 'Status', value: 'Active', icon: <Twitter size={10} /> },
        { label: 'Direct', value: 'Enc', icon: <Mail size={10} /> }
      ]
    },
  ];

  return (
    <nav className={`fixed left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50 transition-all duration-500 ${isScrolled ? 'top-2' : 'top-3'}`}>
      <motion.div 
        layout
        className={`relative px-4 py-2 rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all duration-500 ${isScrolled ? 'bg-white/70' : 'bg-white/40'}`}
        style={{ transformPerspective: 1000 }}
      >
        <div className="flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-anton tracking-tighter flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-sm">G</div>
            <span className="hidden sm:inline">YADEN</span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link, i) => (
              <div 
                key={link.name} 
                className="relative"
                onMouseEnter={() => setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <motion.a
                  href={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 ${activeDropdown === link.name ? 'bg-black text-white' : 'text-gray-500 hover:text-black hover:bg-black/5'}`}
                >
                  {link.name}
                  <motion.div
                    animate={{ rotate: activeDropdown === link.name ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight size={10} className="rotate-90" />
                  </motion.div>
                </motion.a>
                <AnimatePresence>
                  {activeDropdown === link.name && <NavDropdown item={link} />}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05, rotateY: 10 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex px-6 py-2 bg-sky-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-sky-500/20 items-center gap-2"
          >
            Connect_Now
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </motion.button>

          <div className="md:hidden">
            <button 
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                if (!isMobileMenuOpen) {
                  document.body.classList.add('menu-open');
                } else {
                  document.body.classList.remove('menu-open');
                }
              }}
              className="p-2 bg-black/5 rounded-xl"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="md:hidden mt-4 bg-white/90 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden p-4"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <div key={link.name} className="p-4 bg-gray-50 rounded-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <a
                      href={link.href}
                      onClick={() => { setIsMobileMenuOpen(false); document.body.classList.remove('menu-open'); }}
                      className="text-lg font-anton uppercase tracking-tighter"
                    >
                      {link.name}
                    </a>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {link.subData.slice(0, 2).map((data, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-[8px] font-mono text-gray-400 uppercase">{data.label}</span>
                        <span className="text-sm font-anton">{data.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onOpenEditorials, onOpenContact }: { onOpenEditorials: () => void, onOpenContact: () => void }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-white pt-28">
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-sky-50 rounded-full blur-3xl -z-10"
      />
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl -z-10"
      />

      <div className="max-w-7xl mx-auto px-6 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ y: y1, opacity }}
            className="text-center lg:text-left"
          >
            <span className="text-sm font-semibold tracking-[0.3em] uppercase text-gray-400 mb-4 block">
              Editor-in-Chief | Nagaland Post
            </span>
            <h1 className="text-7xl md:text-8xl xl:text-9xl font-anton leading-none mb-6 animate-text-flow uppercase tracking-tighter">
              GEOFREY YADEN
            </h1>
            <p className="max-w-xl mx-auto lg:mx-0 text-lg text-gray-600 font-light leading-relaxed mb-10">
              A veteran journalist and visionary leader shaping the narrative of Northeast India through the lens of truth, integrity, and excellence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <motion.button
                onClick={onOpenEditorials}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-black text-white rounded-full font-medium tracking-wide hover:bg-gray-900 transition-all flex items-center gap-2"
              >
                View Editorials <ChevronRight size={18} />
              </motion.button>
              <motion.button
                onClick={onOpenContact}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex px-10 py-4 border border-gray-200 text-black rounded-full font-medium tracking-wide hover:bg-gray-50 transition-all"
              >
                Get in Touch
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ y: y2 }}
            className="relative perspective-1000 max-w-[280px] sm:max-w-xs mx-auto lg:ml-16 lg:mr-auto mt-12 lg:mt-0"
          >
            <div className="relative z-10 aspect-[4/5]" id="glitchCard">
              <div id="glitchR" className="absolute inset-0 rounded-xl overflow-hidden z-10 pointer-events-none" style={{mixBlendMode:'screen', opacity:0}}>
                <img src="https://i.ibb.co/MrxHD6f/Fs2qf-Khak-AE6f-Bu.jpg" className="w-full h-full object-cover" style={{filter:'url(#redShift)'}} referrerPolicy="no-referrer"/>
              </div>
              <div id="glitchB" className="absolute inset-0 rounded-xl overflow-hidden z-10 pointer-events-none" style={{mixBlendMode:'screen', opacity:0}}>
                <img src="https://i.ibb.co/MrxHD6f/Fs2qf-Khak-AE6f-Bu.jpg" className="w-full h-full object-cover" style={{filter:'url(#blueShift)'}} referrerPolicy="no-referrer"/>
              </div>

              <svg width="0" height="0" style={{position:'absolute'}}>
                <filter id="redShift"><feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/></filter>
                <filter id="blueShift"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"/></filter>
              </svg>

              <div className="absolute inset-0 z-20 rounded-xl pointer-events-none" style={{
                backgroundImage:'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 3px)',
                backgroundSize:'100% 3px'
              }}/>

              {[{t:'4px',l:'4px',bt:'none',bb:'2px solid #0ea5e9',bl:'2px solid #0ea5e9',br:'none'},
                {t:'4px',r:'4px',bt:'none',bb:'2px solid #0ea5e9',bl:'none',br:'2px solid #0ea5e9'},
                {b:'4px',l:'4px',bt:'2px solid #0ea5e9',bb:'none',bl:'2px solid #0ea5e9',br:'none'},
                {b:'4px',r:'4px',bt:'2px solid #0ea5e9',bb:'none',bl:'none',br:'2px solid #0ea5e9'}
              ].map((s,i)=>(
                <div key={i} style={{position:'absolute',width:'18px',height:'18px',zIndex:30,...s}}/>
              ))}

              <div id="glitchMain" className="w-full h-full rounded-xl overflow-hidden" style={{boxShadow:'0 0 0 1px rgba(14,165,233,0.3), 0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(14,165,233,0.15)'}}>
                <img src="https://i.ibb.co/MrxHD6f/Fs2qf-Khak-AE6f-Bu.jpg" className="w-full h-full object-cover" referrerPolicy="no-referrer"/>
                <div className="absolute bottom-0 left-0 right-0 z-20 px-3 py-2" style={{background:'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', backdropFilter:'blur(4px)'}}>
                  <div className="flex justify-between items-center">
                    <span style={{fontFamily:'monospace',fontSize:'0.48rem',color:'#38bdf8',letterSpacing:'0.18em'}}>SYS::GY_EIC_001</span>
                    <div className="flex items-center gap-1">
                      <div style={{width:'5px',height:'5px',borderRadius:'50%',background:'#4ade80',animation:'blink 1s infinite'}}/>
                      <span style={{fontFamily:'monospace',fontSize:'0.45rem',color:'rgba(255,255,255,0.7)'}}>ONLINE</span>
                    </div>
                  </div>
                </div>
              </div>

              <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>

              <script dangerouslySetInnerHTML={{__html:`
                (function(){
                  function glitch(){
                    var r=document.getElementById('glitchR');
                    var b=document.getElementById('glitchB');
                    var m=document.getElementById('glitchMain');
                    if(!r||!b||!m)return;
                    var offX=(Math.random()-0.5)*12;
                    var offY=(Math.random()-0.5)*6;
                    r.style.opacity='0.55';
                    r.style.transform='translate('+(offX+3)+'px,'+offY+'px)';
                    b.style.opacity='0.55';
                    b.style.transform='translate('+(offX-3)+'px,'+offY+'px)';
                    m.style.transform='translateX('+(Math.random()-0.5)*4+'px)';
                    setTimeout(function(){
                      r.style.opacity='0';r.style.transform='none';
                      b.style.opacity='0';b.style.transform='none';
                      m.style.transform='none';
                    }, 80+Math.random()*60);
                    setTimeout(glitch, 1800+Math.random()*2500);
                  }
                  setTimeout(glitch, 800);
                })();
              `}}/>
            </div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-xl shadow-2xl flex items-center justify-center z-20 border border-gray-50"
            >
              <Newspaper size={24} className="text-sky-500" />
            </motion.div>
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-3 -left-3 w-32 h-10 bg-white rounded-lg shadow-2xl flex items-center px-3 gap-2 z-20 border border-gray-50"
            >
              <div className="w-5 h-5 bg-sky-100 rounded-full flex items-center justify-center">
                <Globe size={10} className="text-sky-500" />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Northeast India</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Scroll to explore</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-sky-500 to-transparent"
        />
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-[#020617] rounded-2xl overflow-hidden premium-shadow relative group flex items-center justify-center">
              <RotatingGlobe />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-500/5 via-transparent to-transparent pointer-events-none" />
            </div>
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -right-8 bg-white p-5 rounded-2xl shadow-2xl z-20 hidden md:block border border-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Experience</p>
                  <p className="text-lg font-anton">30+ YEARS</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-anton mb-8 uppercase tracking-tight animate-text-flow">A Legacy in Print</h2>
            <div className="space-y-6 text-gray-600 leading-relaxed text-lg font-light">
              <p>Geofrey Yaden is the founder and Editor-in-Chief of <span className="font-semibold text-black">Nagaland Post</span>, the first and highest circulated English daily in Nagaland. With over three decades of experience, he has been a pivotal figure in the regional media landscape.</p>
              <p>His journey is defined by a commitment to independent journalism and providing a platform for the voices of the Northeast. Under his leadership, Nagaland Post has become a trusted source of information, known for its balanced reporting and insightful analysis.</p>
              <p>Beyond the newsroom, Geofrey is an advocate for social change, community development, and the preservation of cultural heritage. His work continues to inspire a new generation of journalists across the region.</p>
            </div>
            <div className="grid grid-cols-2 gap-8 mt-12">
              <div>
                <p className="text-3xl font-anton text-black">1990</p>
                <p className="text-sm text-gray-400 uppercase tracking-widest mt-1">Founded Nagaland Post</p>
              </div>
              <div>
                <p className="text-3xl font-anton text-black">100K+</p>
                <p className="text-sm text-gray-400 uppercase tracking-widest mt-1">Daily Readers</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Experience = () => {
  const experiences = [
    {
      year: '1990 - Present',
      role: 'Editor-in-Chief & Founder',
      company: 'Nagaland Post',
      desc: "Established the first English daily in Nagaland, leading it to become the state's most influential media outlet.",
      icon: <Newspaper className="text-sky-500" />
    },
    {
      year: '2005 - 2015',
      role: 'Regional Media Consultant',
      company: 'Northeast Press Council',
      desc: 'Advised on media ethics and regional reporting standards for various organizations across Northeast India.',
      icon: <Users className="text-sky-500" />
    },
    {
      year: '2010 - Present',
      role: 'Social Advocate',
      company: 'Community Initiatives',
      desc: 'Leading various social awareness campaigns focusing on youth empowerment and tribal rights.',
      icon: <Globe className="text-sky-500" />
    }
  ];

  return (
    <section id="experience" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-anton mb-4 uppercase tracking-tight animate-text-flow">Professional Journey</h2>
          <p className="text-gray-400 uppercase tracking-[0.3em] text-xs font-bold">Milestones of a distinguished career</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-white p-8 rounded-2xl premium-shadow border border-gray-100 hover:border-sky-200 transition-all group"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-sky-500 group-hover:text-white transition-all">
                {exp.icon}
              </div>
              <span className="text-xs font-bold text-sky-500 uppercase tracking-widest mb-2 block">{exp.year}</span>
              <h3 className="text-2xl font-anton mb-2 uppercase">{exp.role}</h3>
              <p className="text-sm font-semibold text-gray-400 mb-6">{exp.company}</p>
              <p className="text-gray-500 font-light leading-relaxed">{exp.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EditorialSection = ({ onOpenEditorials }: { onOpenEditorials: () => void }) => {
  const [activeEditorial, setActiveEditorial] = useState<number | null>(null);

  const editorials = [
    {
      title: "The Future of Regional Journalism in the Digital Age",
      category: "Media",
      date: "Oct 2023",
      image: "https://i.ibb.co/TBqqW80W/thequint-2015-09-85a8ee61-8052-4476-bd6a-06c38b84daac-naga-reuters.webp",
      readTime: "15 min read",
      content: "The landscape of regional journalism in Northeast India is undergoing a seismic shift. As of Q3 2023, digital penetration in Nagaland has reached an unprecedented 68%, a 14% increase from the previous fiscal year. The traditional revenue model is facing a 22% year-on-year decline in local classifieds, while digital ad-spend has surged by 45%.\n\nData analysis reveals 82% of news is consumed via mobile devices. However, a Trust Premium exists for established print brands — 74% of 10,000 residents surveyed cited Nagaland Post as their primary source for verified information.\n\nThe gap between print and digital ad revenue is closing, but monetization per user on digital platforms remains at 1/10th of print, necessitating a Hybrid-First strategy.\n\nLocal news outlets are seeing a 30% decrease in organic reach due to algorithm changes. Direct-to-consumer models like WhatsApp bulletins have seen 120% growth in subscriber retention.\n\nThe future is not Digital vs. Print but Truth vs. Noise. As data volume increases, the Editor Filter becomes the most valuable commodity.",
    },
    {
      title: "Northeast India: Bridging the Gap through Dialogue",
      category: "Politics",
      date: "Aug 2023",
      image: "https://i.ibb.co/MxzdxSy4/Opinion-India-s-protests-could-be-a-tipping-point-against-authoritarianism.jpg",
      readTime: "15 min read",
      content: "Since the inception of the Act East Policy, infrastructure investment in the Northeast has seen a 300% increase in capital expenditure. The Trans-Asian Highway project, spanning 1,360 km, is projected to increase cross-border trade with Myanmar by 45% by 2026.\n\nData from the Ministry of Home Affairs indicates a 75% reduction in insurgency-related incidents over the last decade. This Peace Dividend has translated into a 12% increase in State GDP, a 25% growth in hospitality, and a 40% rise in youth literacy.\n\nConnectivity remains the primary catalyst for change, with four new state capitals to be connected by rail by 2025, 12 new airports under the UDAN scheme, and 10,000 km of optical fiber laid in 2023 alone.\n\nThe Northeast is no longer a buffer zone but a bridgehead. Trade through the Moreh-Tamu border stands at $50M annually, with potential to reach $500M if the trilateral highway is operationalized.\n\nInter-state border disputes have caused an estimated $12M in economic losses in the last 24 months. The region produces 15% of India's skilled workforce yet local employment remains at 40% — a gap driving migration.",
    },
    {
      title: "Preserving Tribal Heritage in a Globalized World",
      category: "Culture",
      date: "Jun 2023",
      image: "https://i.ibb.co/pjZxcTNH/Naga-Traditional-Attire.jpg",
      readTime: "15 min read",
      content: "UNESCO classifies 12 languages in the Northeast as critically endangered. Among Gen-Z, fluency in native tribal dialects has dropped to 35%, compared to 92% in the Boomer generation.\n\nGlobal pop culture has a 90% penetration rate in urban Naga households, leading to a Cultural Dilution index of 0.65, where traditional practices are increasingly viewed as performative rather than lived.\n\nDigital archiving has emerged as a vital solution. In 2023 alone, 1,200 hours of oral traditions were recorded, 4,500 artifacts cataloged, and 12 community wiki projects activated.\n\nCultural tourism generates $15M annually, supporting 5,000 livelihoods. However, only 20% of this revenue reaches rural artisans.\n\nA survey of 5,000 tribal youth shows 65% want to preserve their heritage but lack the tools, while 80% believe digital platforms are key to cultural survival.\n\nRecommendations include integrating tribal history in the national curriculum, incentivizing local-dialect digital content, and establishing Living Museums in every district.",
    }
  ];

  return (
    <section id="editorial" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-5xl font-anton mb-4 uppercase tracking-tight animate-text-flow">Featured Editorials</h2>
            <p className="text-gray-500 max-w-xl font-light">A collection of insightful pieces exploring the complexities of the Northeast and the evolving role of media.</p>
          </div>
          <motion.div
            onClick={onOpenEditorials}
            whileHover={{ x: 5 }}
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-sky-500 cursor-pointer"
          >
            View Archive <ChevronRight size={16} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {editorials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setActiveEditorial(i)}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-6 premium-shadow">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {item.category}
                </div>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <Calendar size={12} /> {item.date}
                </div>
                <div className="w-1 h-1 bg-gray-200 rounded-full" />
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <BookOpen size={12} /> {item.readTime}
                </div>
              </div>
              <h3 className="text-xl font-anton uppercase leading-tight group-hover:text-sky-500 transition-colors">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeEditorial !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white overflow-y-auto"
          >
            <div className="max-w-4xl mx-auto px-6 py-24 relative">
              <button 
                onClick={() => setActiveEditorial(null)}
                className="fixed top-8 left-8 md:left-12 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors z-[110]"
              >
                <ChevronRight size={14} className="rotate-180" /> Back
              </button>

              <div className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-4 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {editorials[activeEditorial].category}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {editorials[activeEditorial].date}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {editorials[activeEditorial].readTime}
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-anton uppercase leading-none mb-8">
                  {editorials[activeEditorial].title}
                </h1>
                <div className="h-1 w-24 bg-sky-500 mb-12" />
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap font-light text-gray-700 leading-relaxed font-sans">
                  {editorials[activeEditorial].content}
                </div>
              </div>

              <div className="mt-24 pt-12 border-t border-gray-100 text-center">
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em] mb-4">End_of_Data_Stream</p>
                <div 
                  className="inline-block px-12 py-4 bg-gray-50 text-gray-400 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setActiveEditorial(null)}
                >
                  Close_Reading_Mode
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl p-8 md:p-12 premium-shadow border border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-5xl font-anton mb-8 uppercase tracking-tight animate-text-flow">Let's Connect</h2>
            <p className="text-gray-500 text-lg font-light leading-relaxed mb-12">
              For editorial inquiries, speaking engagements, or professional collaborations, please feel free to reach out.
            </p>
            <div className="space-y-8">
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-all">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Email Address</p>
                  <p className="text-lg font-medium">editor@nagalandpost.com</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-all">
                  <Globe size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Publication</p>
                  <p className="text-lg font-medium">www.nagalandpost.com</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-12">
              {[Linkedin, Twitter, Mail].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -5 }}
                  className="w-12 h-12 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-sky-500 hover:border-sky-200 transition-all"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-8 md:p-12 rounded-[2rem]">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-2">Full Name</label>
                  <input type="text" className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-sky-500 transition-all font-light" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-2">Email</label>
                  <input type="email" className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-sky-500 transition-all font-light" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-2">Subject</label>
                <input type="text" className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-sky-500 transition-all font-light" placeholder="Collaboration Inquiry" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold ml-2">Message</label>
                <textarea rows={4} className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-sky-500 transition-all font-light resize-none" placeholder="Your message here..." />
              </div>
              <div className="flex justify-center pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-10 py-3 bg-sky-500 text-white rounded-full text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-sky-500/20 hover:bg-sky-600 transition-all"
                >
                  Send Message
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-xl font-anton tracking-tighter">
          G. <span className="text-sky-500">YADEN</span>
        </div>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} Geofrey Yaden. All Rights Reserved.
        </p>
        <div className="flex gap-8">
          <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-sky-500 transition-colors">Privacy Policy</a>
          <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-sky-500 transition-colors">Terms of Service</a>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em] animate-text-flow">
          Developed by NITI Technologies
        </p>
      </div>
    </footer>
  );
};

const EditorialsArchive = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto p-8 md:p-20">
      <div className="max-w-4xl mx-auto">
        <div onClick={onClose} className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-500 cursor-pointer mb-12 inline-block hover:opacity-70 transition-opacity">
          Back to Home
        </div>
        <h1 className="text-6xl font-anton uppercase tracking-tighter mb-12">The Editorial Archive</h1>
        <div className="space-y-12 text-gray-700 leading-relaxed font-light text-lg">
          <section>
            <h2 className="text-2xl font-anton uppercase mb-4">A Vision for Regional Journalism</h2>
            <p>The journey of Nagaland Post began with a simple yet profound vision: to provide a voice for the people of Nagaland and the wider Northeast region. In the early 1990s, the regional media landscape was vastly different, with limited access to independent news and a lack of platforms for local perspectives. Geofrey Yaden recognized this gap and set out to create a publication that would not only report the news but also analyze the underlying issues shaping the region's future.</p>
            <p className="mt-4">Over the decades, the editorials of Nagaland Post have served as a barometer for the socio-political climate of the state. From the complexities of the Naga peace process to the challenges of economic development and social reform, these pieces have consistently advocated for transparency, accountability, and the rule of law.</p>
          </section>
          <section>
            <h2 className="text-2xl font-anton uppercase mb-4">The Role of Media in Conflict Resolution</h2>
            <p>In a region marked by long-standing conflicts and historical grievances, the role of the media is particularly critical. Geofrey Yaden has often written about the responsibility of journalists to act as bridge-builders rather than provocateurs. His editorials have frequently emphasized the importance of dialogue and mutual understanding as the only sustainable path to peace.</p>
            <p className="mt-4">The editorial stance has consistently been one of constructive criticism. While never shying away from pointing out the failures of governance or the pitfalls of social movements, the goal has always been to offer a way forward.</p>
          </section>
          <section>
            <h2 className="text-2xl font-anton uppercase mb-4">Navigating the Digital Transformation</h2>
            <p>As the world transitioned into the digital age, the challenges facing regional journalism evolved. The rise of social media and the 24-hour news cycle brought new pressures to the traditional print model. Yaden has explored the implications of this shift, arguing that while the medium may change, the core values of journalism must remain constant.</p>
            <p className="mt-4">He has been a vocal advocate for media literacy, urging readers to be discerning consumers of information in an era of polarized narratives.</p>
          </section>
          <section>
            <h2 className="text-2xl font-anton uppercase mb-4">Preserving Cultural Identity</h2>
            <p>Beyond politics and economics, a recurring theme in the editorials has been the preservation of Naga cultural identity. Geofrey Yaden has used his platform to highlight the importance of cultural heritage as a source of strength and resilience for the community.</p>
          </section>
          <section>
            <h2 className="text-2xl font-anton uppercase mb-4">The Future of the Northeast</h2>
            <p>Looking ahead, the editorials continue to focus on the potential of the Northeast as a gateway to Southeast Asia. Yaden has written extensively on the Act East policy and the need for better infrastructure, education, and economic opportunities for the youth of the region.</p>
          </section>
        </div>
        <div onClick={onClose} className="mt-20 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 cursor-pointer hover:text-sky-500 transition-colors">
          End of Archive / Return to Home
        </div>
      </div>
    </div>
  );
};

const ContactDetails = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto p-8 md:p-20">
      <div className="max-w-4xl mx-auto">
        <div onClick={onClose} className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-500 cursor-pointer mb-12 inline-block hover:opacity-70 transition-opacity">
          Back to Home
        </div>
        <h1 className="text-6xl font-anton uppercase tracking-tighter mb-12">Engagement Protocols</h1>
        <div className="space-y-12 text-gray-700 leading-relaxed font-light text-lg">
          <section>
            <h2 className="text-2xl font-anton uppercase mb-4">Editorial Inquiries</h2>
            <p>For all matters related to the editorial content of Nagaland Post, including letters to the editor, opinion pieces, and press releases, please follow the established submission guidelines. All submissions must be accompanied by the full name and contact details of the author.</p>
            <p className="mt-4">Direct editorial correspondence should be addressed to the Editor-in-Chief. While we strive to review all submissions in a timely manner, the high volume of correspondence means that we cannot guarantee a personal response to every inquiry.</p>
          </section>
          <section>
            <h2 className="text-2xl font-anton uppercase mb-4">Professional Engagements</h2>
            <p>Geofrey Yaden is available for a limited number of speaking engagements, panel discussions, and media consultations throughout the year. His areas of expertise include regional journalism, media ethics, socio-political developments in Northeast India, and community leadership.</p>
            <p className="mt-4">Requests for professional engagements should be submitted at least six to eight weeks in advance. Please include a detailed description of the event, the expected audience, and the specific role requested.</p>
          </section>
          <section>
            <h2 className="text-2xl font-anton uppercase mb-4">Office Information</h2>
            <p>The main editorial office of Nagaland Post is located in Dimapur, Nagaland. This facility serves as the central hub for our reporting, editing, and production teams.</p>
            <p className="mt-4">Please note that the editorial offices are professional workspaces and are not open to the general public for unscheduled visits. All meetings and consultations must be arranged in advance through the appropriate administrative channels.</p>
          </section>
          <section>
            <h2 className="text-2xl font-anton uppercase mb-4">Community Initiatives</h2>
            <p>As part of our commitment to social responsibility, we actively support various community initiatives focusing on education, youth empowerment, and cultural preservation. If you are representing a non-profit organization seeking collaboration, please provide a formal proposal detailing your objectives.</p>
          </section>
          <section>
            <h2 className="text-2xl font-anton uppercase mb-4">Legal and Ethical Standards</h2>
            <p>Nagaland Post adheres to the highest standards of journalistic ethics and legal compliance. We are committed to the principles of accuracy, fairness, and independence. Any concerns regarding the ethical conduct of our reporting should be directed to our legal department.</p>
          </section>
        </div>
        <div onClick={onClose} className="mt-20 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 cursor-pointer hover:text-sky-500 transition-colors">
          End of Protocols / Return to Home
        </div>
      </div>
    </div>
  );
};

const ProfessionalJourneyGSAP = () => {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
     <div style="height:280px; position:relative; overflow:hidden; background:#ffffff;">
  <canvas id="transitionCanvas" style="position:absolute; inset:0; width:100%; height:100%;"></canvas>
  <div style="position:absolute; inset:0; background:linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,1) 100%); pointer-events:none; z-index:2;"></div>
  <div id="scanLine" style="position:absolute; left:0; right:0; height:2px; background:linear-gradient(to right, transparent, rgba(14,165,233,0.8), rgba(56,189,248,1), rgba(14,165,233,0.8), transparent); box-shadow:0 0 18px 4px rgba(56,189,248,0.5); z-index:3; top:0;"></div>
  <div style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:300px; height:300px; background:radial-gradient(ellipse, rgba(56,189,248,0.12) 0%, transparent 70%); filter:blur(20px); z-index:1; animation:orbPulse 3s ease-in-out infinite;"></div>
  <style>
    @keyframes orbPulse { 0%,100%{opacity:0.4;transform:translate(-50%,-50%) scale(1);} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.3);} }
    @keyframes scanAnim { 0%{top:-2px;} 100%{top:100%;} }
    #scanLine { animation: scanAnim 2.5s linear infinite; }
  </style>
  <script>
    (function(){
      var c=document.getElementById('transitionCanvas');
      if(!c)return;
      var ctx=c.getContext('2d');
      var pts=[];
      function resize(){c.width=c.offsetWidth;c.height=c.offsetHeight;}
      resize();
      for(var i=0;i<55;i++) pts.push({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-0.5)*0.4,vy:(Math.random()-0.5)*0.4,r:Math.random()*1.8+0.5,o:Math.random()*0.5+0.2});
      function draw(){
        ctx.clearRect(0,0,c.width,c.height);
        pts.forEach(function(p){
          p.x+=p.vx; p.y+=p.vy;
          if(p.x<0||p.x>c.width)p.vx*=-1;
          if(p.y<0||p.y>c.height)p.vy*=-1;
          ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
          ctx.fillStyle='rgba(14,165,233,'+p.o+')';ctx.fill();
        });
        pts.forEach(function(a,i){pts.forEach(function(b,j){
          if(j<=i)return;
          var d=Math.hypot(a.x-b.x,a.y-b.y);
          if(d<90){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
          ctx.strokeStyle='rgba(14,165,233,'+(0.12*(1-d/90))+')';ctx.lineWidth=0.6;ctx.stroke();}
        });});
        requestAnimationFrame(draw);
      }
      draw();
    })();
  </script>
</div>
  <div style="position:absolute; bottom:0; left:0; right:0; height:60px; background:linear-gradient(to bottom, transparent, #ffffff);"></div>
</div>
      <div class="journey-pin-wrapper" id="pinWrapper" style="position:relative;">
        <div class="journey-sticky" id="journeySticky" style="position:sticky; top:0; height:100vh; width:100%; overflow:hidden; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#ffffff; background-image: radial-gradient(circle, rgba(0,0,0,0.065) 1px, transparent 1px); background-size: 28px 28px; padding-top: 80px;">
          
          <h2 id="journeyHeading" style="font-family: 'Poppins', sans-serif; font-size: clamp(2rem, 5vw, 4rem); font-weight: 700; letter-spacing: -0.02em; text-align: center; margin-bottom: 56px; opacity:0; transform:translateY(22px); text-transform: uppercase; background: linear-gradient(90deg, #0ea5e9, #38bdf8, #7dd3fc, #0ea5e9); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: skyFlow 3s linear infinite;">
            The Journey
          </h2>

          <div class="cards-stage" id="cardsStage" style="position:relative; width:100%; max-width:900px; height:340px; display:flex; align-items:center; justify-content:center; perspective:1200px;">
            
            <div id="wrapSingle" style="position:absolute; left:50%; top:50%; margin-left:-280px; margin-top:-150px; z-index:10; will-change:transform;">
              <div id="cardSingle" style="width:560px; height:300px; border-radius:18px; overflow:hidden; position:relative;">
                <div style="position:absolute; inset:0; background: radial-gradient(ellipse at 72% 18%, #ef4444 0%, transparent 52%), radial-gradient(ellipse at 28% -5%, #dc2626 0%, transparent 48%), linear-gradient(175deg, #b91c1c 0%, #991b1b 28%, #7f1d1d 55%, #450a0a 100%);"></div>
                <svg id="crackOverlay" style="position:absolute; inset:0; z-index:5; pointer-events:none; opacity:0; width:100%; height:100%;" viewBox="0 0 560 300">
                  <line x1="186" y1="0" x2="186" y2="300" stroke="rgba(255,255,255,0.9)" stroke-width="1.5" />
                  <line x1="374" y1="0" x2="374" y2="300" stroke="rgba(255,255,255,0.9)" stroke-width="1.5" />
                  <line x1="186" y1="0" x2="186" y2="300" stroke="rgba(255,200,180,0.4)" stroke-width="4" />
                  <line x1="374" y1="0" x2="374" y2="300" stroke="rgba(255,200,180,0.4)" stroke-width="4" />
                </svg>
                <svg style="position:absolute; bottom:-2px; left:50%; transform:translateX(-50%); width:115%;" viewBox="0 0 644 100">
                  <path d="M0,100 L120,40 L240,80 L360,20 L480,90 L644,100 Z" fill="rgba(0,0,0,0.4)" />
                </svg>
              </div>
            </div>

            <div class="flip-wrap" id="flipLeft" style="position:absolute; left:50%; top:50%; width:232px; height:298px; margin-left:-116px; margin-top:-149px; perspective:900px; will-change:transform; opacity:0; z-index:4;">
              <div class="card-inner" id="innerLeft" style="width:100%; height:100%; position:relative; transform-style:preserve-3d; will-change:transform; transform:rotateY(180deg);">
                <div style="position:absolute; inset:0; border-radius:18px; overflow:hidden; backface-visibility:hidden; -webkit-backface-visibility:hidden; transform:rotateY(180deg); background: linear-gradient(175deg, #064e3b 0%, #022c22 100%);">
                   <svg style="position:absolute; bottom:-2px; left:50%; transform:translateX(-50%); width:115%;" viewBox="0 0 232 100">
                      <path d="M0,100 L50,40 L100,80 L150,20 L232,100 Z" fill="rgba(0,0,0,0.4)" />
                   </svg>
                </div>
                <div style="position:absolute; inset:0; border-radius:18px; overflow:hidden; backface-visibility:hidden; -webkit-backface-visibility:hidden; background: linear-gradient(148deg, #065f46 0%, #064e3b 55%, #022c22 100%); box-shadow: -6px 20px 48px rgba(0,0,0,0.65); padding: 20px 20px 24px; display:flex; flex-direction:column; justify-content:space-between;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                  <div class="card-body">
                    <span class="card-year" style="font-family: 'Poppins', sans-serif; font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.45); display:block; margin-bottom:4px;">Est. 1990s</span>
                    <h3 class="card-title" style="font-family: 'Poppins', sans-serif; font-size: 1.35rem; font-weight: 600; color: #fff; margin-bottom:8px;">Roots in Nagaland</h3>
                    <p class="card-desc" style="font-family: 'Poppins', sans-serif; font-weight: 300; font-size: 0.8rem; color: rgba(255,255,255,0.65); line-height:1.4;">Born and raised in the heart of Northeast India, where every story began — reporting local truths that the world had never heard.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flip-wrap" id="flipCenter" style="position:absolute; left:50%; top:50%; width:232px; height:298px; margin-left:-116px; margin-top:-149px; perspective:900px; will-change:transform; opacity:0; z-index:6;">
              <div class="card-inner" id="innerCenter" style="width:100%; height:100%; position:relative; transform-style:preserve-3d; will-change:transform; transform:rotateY(180deg);">
                <div style="position:absolute; inset:0; border-radius:18px; overflow:hidden; backface-visibility:hidden; -webkit-backface-visibility:hidden; transform:rotateY(180deg); background: linear-gradient(175deg, #991b1b 0%, #450a0a 100%);">
                   <svg style="position:absolute; bottom:-2px; left:50%; transform:translateX(-50%); width:115%;" viewBox="0 0 232 100">
                      <path d="M0,100 L50,40 L100,80 L150,20 L232,100 Z" fill="rgba(0,0,0,0.4)" />
                   </svg>
                </div>
                <div style="position:absolute; inset:0; border-radius:18px; overflow:hidden; backface-visibility:hidden; -webkit-backface-visibility:hidden; background: radial-gradient(ellipse at 65% 18%, #ef4444 0%, transparent 55%), radial-gradient(ellipse at 25% -5%, #dc2626 0%, transparent 50%), linear-gradient(175deg, #b91c1c 0%, #991b1b 30%, #7f1d1d 60%, #450a0a 100%); box-shadow: 0 24px 60px rgba(0,0,0,0.75); padding: 20px 20px 24px; display:flex; flex-direction:column; justify-content:space-between;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></svg>
                  <div class="card-body">
                    <span class="card-year" style="font-family: 'Poppins', sans-serif; font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.45); display:block; margin-bottom:4px;">1990 — Present</span>
                    <h3 class="card-title" style="font-family: 'Poppins', sans-serif; font-size: 1.35rem; font-weight: 600; color: #fff; margin-bottom:8px;">30 Years. 5K+ Stories.</h3>
                    <p class="card-desc" style="font-family: 'Poppins', sans-serif; font-weight: 300; font-size: 0.8rem; color: rgba(255,255,255,0.65); line-height:1.4;">Three decades of bridging local narratives with international discourse — building a voice that spans from Nagaland to the global stage.</p>
                  </div>
                  <svg style="position:absolute; bottom:-2px; left:50%; transform:translateX(-50%); width:165%; opacity:0.6;" viewBox="0 0 382 100">
                      <path d="M0,100 L80,40 L160,80 L240,20 L382,100 Z" fill="rgba(0,0,0,0.8)" />
                   </svg>
                </div>
              </div>
              <div id="centerGlow" style="position:absolute; bottom:-30px; left:50%; transform:translateX(-50%); width:200px; height:50px; background:radial-gradient(ellipse, rgba(239,68,68,0.4) 0%, transparent 70%); filter:blur(12px); pointer-events:none; opacity:0; z-index:0;"></div>
            </div>

            <div class="flip-wrap" id="flipRight" style="position:absolute; left:50%; top:50%; width:232px; height:298px; margin-left:-116px; margin-top:-149px; perspective:900px; will-change:transform; opacity:0; z-index:5;">
              <div class="card-inner" id="innerRight" style="width:100%; height:100%; position:relative; transform-style:preserve-3d; will-change:transform; transform:rotateY(180deg);">
                <div style="position:absolute; inset:0; border-radius:18px; overflow:hidden; backface-visibility:hidden; -webkit-backface-visibility:hidden; transform:rotateY(180deg); background: linear-gradient(175deg, #1e3a8a 0%, #172554 100%);">
                   <svg style="position:absolute; bottom:-2px; left:50%; transform:translateX(-50%); width:115%;" viewBox="0 0 232 100">
                      <path d="M0,100 L50,40 L100,80 L150,20 L232,100 Z" fill="rgba(0,0,0,0.4)" />
                   </svg>
                </div>
                <div style="position:absolute; inset:0; border-radius:18px; overflow:hidden; backface-visibility:hidden; -webkit-backface-visibility:hidden; background: linear-gradient(148deg, #1e40af 0%, #1e3a8a 55%, #172554 100%); box-shadow: 6px 20px 48px rgba(0,0,0,0.65); padding: 20px 20px 24px; display:flex; flex-direction:column; justify-content:space-between;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  <div class="card-body">
                    <span class="card-year" style="font-family: 'Poppins', sans-serif; font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.45); display:block; margin-bottom:4px;">2025 — Now</span>
                    <h3 class="card-title" style="font-family: 'Poppins', sans-serif; font-size: 1.35rem; font-weight: 600; color: #fff; margin-bottom:8px;">Global Perspective</h3>
                    <p class="card-desc" style="font-family: 'Poppins', sans-serif; font-weight: 300; font-size: 0.8rem; color: rgba(255,255,255,0.65); line-height:1.4;">Now shaping the socio-political conversation of India's Northeast for a worldwide audience — the work continues, the mission never stops.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div id="scrollHint" style="position:absolute; bottom:36px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:8px; z-index:20;">
            <div style="width:1px; height:38px; background:linear-gradient(to bottom, rgba(0,0,0,0.3), transparent); animation: pulse 2s infinite;"></div>
            <span style="font-family: 'Poppins', sans-serif; font-weight: 400; color: rgba(0,0,0,0.5); font-size: 0.8rem;">scroll</span>
          </div>

        </div>
      </div>

      <style>
        @keyframes pulse {
          0% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.2); }
          100% { opacity: 0.3; transform: scaleY(1); }
        }
        @keyframes skyFlow {
          to { background-position: 200% center; }
        }
      </style>
    ` }} />
  );
};

export default function App() {
  const [currentSubpage, setCurrentSubpage] = useState<null | 'editorials' | 'contact'>(null);

  return (
    <div className="antialiased selection:bg-sky-100 selection:text-sky-900">
      <AnimatePresence mode="wait">
        {currentSubpage === 'editorials' ? (
          <motion.div key="editorials" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EditorialsArchive onClose={() => setCurrentSubpage(null)} />
          </motion.div>
        ) : currentSubpage === 'contact' ? (
          <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ContactDetails onClose={() => setCurrentSubpage(null)} />
          </motion.div>
        ) : (
          <motion.div 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Navbar />
            <main>
              <Hero onOpenEditorials={() => setCurrentSubpage('editorials')} onOpenContact={() => setCurrentSubpage('contact')} />
              <About />
              <EditorialSection onOpenEditorials={() => setCurrentSubpage('editorials')} />
              <ProfessionalJourneyGSAP />
              <Contact />
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
