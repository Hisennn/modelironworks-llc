'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import EmblaCarousel from '../components/EmblaCarousel'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  // Handle scroll effects (optimized with requestAnimationFrame)
  useEffect(() => {
    let rafId: number | null = null

    const handle = () => {
      setScrolled(window.scrollY > 60)
      setShowBackToTop(window.scrollY > 300)

      // Active section detection (use getBoundingClientRect for stability)
      let current = ''
      sectionsRef.current.forEach((section) => {
        if (section) {
          const top = section.getBoundingClientRect().top
          if (top <= 120) current = section.id
        }
      })
      setActiveSection(current)

      // Fade in animation
      document.querySelectorAll<HTMLElement>('.fade-in').forEach(section => {
        const rect = section.getBoundingClientRect()
        if (rect.top < window.innerHeight - 80) section.classList.add('visible')
      })
    }

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(handle)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    handle()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileMenuOpen && !(e.target as HTMLElement).closest('#main-nav') && !(e.target as HTMLElement).closest('.mobile-toggle')) {
        setMobileMenuOpen(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [mobileMenuOpen])

  // Handle lightbox ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImage(null)
    }

    if (lightboxImage) {
      document.addEventListener('keydown', handleEsc)
    }

    return () => document.removeEventListener('keydown', handleEsc)
  }, [lightboxImage])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      setMobileMenuOpen(false)
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const galleryImages = [
    'escada.png', 'corrimao.png', 'peca0.png', 'detalhe.png', 
    'escada6.png', 'escada3.png', 'corrimao3.png', 'corrimao4.png',
    'corrimao5.png', 'corrimao6.png', 'corrimao7.png', 'corrimao8.png',
    'corrimao9.png', 'corrimao10.png', 'corrimao11.png', 'peca5.png',
    'corrimao13.png', 'corrimao14.png', 'peca7.png', 'corrimao16.png',
    'corrimao17.png', 'corrimao18.png', 'corrimao19.png', 'corrimao20.png',
    'corrimao21.png', 'corrimao22.png', 'corrimao23.png', 'corrimao24.png'
  ]

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#reviews', label: 'Reviews' },
    { href: '#contact', label: 'Contact' }
  ]

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

        .fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s, transform 0.7s;
        }
        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        body {
          background-color: #ffffff;
          color: #222b36; 
          font-family: 'Inter', sans-serif; /* Define a fonte Inter como padrão */
        }
        a {
          color: #f39c12; /* Ajustado para amarelo */
        }
        a:hover {
          color: #d68910; /* Amarelo mais escuro no hover */
        }
        nav a {
          color: #222b36; /* Texto preto */
        }
        nav a:hover {
          color: #f39c12; /* Texto amarelo no hover */
        }
        .button {
          background-color: #f39c12;
          color: #222b36; /* Texto preto */
        }
        .button:hover {
          background-color: #d68910; /* Apenas o fundo escurece */
          color: #222b36; /* Texto permanece preto */
        }
        .header-title {
          font-size: 2rem; /* Aumenta o tamanho da fonte */
          color: #f39c12; /* Mantém o amarelo */
        }
        .get-in-touch {
          background-color: transparent;
          color: #f39c12;
          border: 2px solid #f39c12;
        }
        .get-in-touch:hover {
          background-color: #f39c12; /* Fundo amarelo no hover */
          color: #ffffff; /* Texto branco no hover */
        }
      `}</style>

      {/* Header */}
      <header className={`bg-white border-b border-[#ececec] pt-[18px] sticky top-0 z-[100] transition-all duration-300 ${
        scrolled ? 'bg-white/80 shadow-[0_2px_18px_rgba(0,0,0,0.08)] !border-[#e5e5e5] backdrop-blur-[4px]' : ''
      }`}>
        <div className="w-full max-w-[1200px] mx-auto px-6 flex flex-col items-center pb-[10px] md:flex-col md:items-center">
          <a href="#" className="header-title tracking-[0.04em] mb-[10px] whitespace-nowrap transition-all duration-200 md:text-[1.3rem] max-[576px]:text-[1rem] max-[768px]:text-[1.15rem] max-[768px]:mb-0 font-semibold">
            Model IronWorks LLC
          </a>
          
          <button 
            className="mobile-toggle hidden max-[768px]:block absolute right-[30px] top-[18px] z-[2001] bg-transparent border-none text-[#f39c12] text-[2rem] cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>

          <nav 
            id="main-nav" 
            className={`w-full flex justify-center max-[768px]:fixed max-[768px]:top-0 max-[768px]:left-0 max-[768px]:right-0 max-[768px]:bg-white/[0.97] max-[768px]:flex-col max-[768px]:items-center max-[768px]:justify-start max-[768px]:h-screen max-[768px]:w-screen max-[768px]:z-[1200] max-[768px]:pt-20 max-[768px]:transition-transform max-[768px]:duration-300 max-[768px]:shadow-[0_2px_18px_rgba(0,0,0,0.08)] ${
              mobileMenuOpen ? 'max-[768px]:translate-y-0' : 'max-[768px]:-translate-y-full'
            }`}
          >
            <ul className="flex gap-[38px] list-none p-0 m-0 max-[768px]:flex-col max-[768px]:gap-7">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className={`text-[#222b36] font-semibold text-[1.13rem] py-[6px] border-b-2 transition-all duration-200 hover:text-[#f39c12] hover:border-[#f39c12] ${
                      activeSection === link.href.substring(1) ? 'text-[#f39c12] border-[#f39c12]' : 'border-transparent'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Content */}
      <section className="fade-in bg-white text-[#222b36] py-[120px] pb-20 text-center border-b border-[#ececec] max-[576px]:py-10 max-[576px]:pb-6">
        <div className="w-full max-w-[700px] mx-auto px-6">
          <h1 className="text-[3.1rem] font-bold text-[#222b36] mb-[18px] leading-tight max-[992px]:text-[2.2rem] max-[576px]:text-[1.2rem]">
            Quality Metalwork & Custom Solutions
          </h1>
          <p className="text-[1.18rem] mb-8 text-[#444] leading-relaxed">
            With over 25 years of experience in the industry, we create beautiful and durable metalwork for residential and commercial projects.
          </p>
          <div className="flex justify-center gap-[18px]">
            <a href="#gallery" onClick={(e) => scrollToSection(e, '#gallery')} className="button inline-block px-[34px] py-[13px] rounded-[5px] font-bold text-[1.08rem] tracking-[0.03em] transition-all duration-200 shadow-[0_2px_8px_#f39c121a]">
              View Our Work
            </a>
            <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="get-in-touch inline-block px-[34px] py-[13px] rounded-[5px] font-bold text-[1.08rem] tracking-[0.03em] transition-all duration-200">
              Get In Touch
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={el => { sectionsRef.current[0] = el }} className="fade-in py-[90px] bg-white">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-12 max-[992px]:flex-col max-[992px]:gap-6" style={{ minHeight: '600px' }}>
            <div className="flex-1 max-[992px]:order-2">
              <h2 className="text-[2.3rem] font-bold text-[#222b36] mb-[22px] relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-[60px] after:h-[3px] after:bg-[#f39c12] after:rounded-sm max-[992px]:text-[1.4rem] max-[576px]:text-[1rem]">
                About Us
              </h2>
              <p className="mb-4 leading-relaxed text-[1.08rem]">
                Welcome to Model IronWorks, where craftsmanship meets precision. For over 25 years, I&apos;ve been dedicated to creating stunning metal fabrications that combine functionality with aesthetic appeal.
              </p>
              <p className="mb-4 leading-relaxed text-[1.08rem]">
                My journey in metalworking began with a passion for transforming raw materials into beautiful, durable structures. Over the decades, I&apos;ve honed my skills in welding and custom metal fabrication, establishing a reputation for delivering exceptional quality work.
              </p>
              <p className="mb-4 leading-relaxed text-[1.08rem]">
                From elegant handrails and staircases to custom gates and various metal structures, every project receives my personal attention to detail and commitment to safety. I use only the highest quality materials to ensure the longevity and strength of each piece.
              </p>
              
              <div className="flex mt-[38px] text-center gap-[10px]">
                <div className="flex-1 p-[18px]">
                  <div className="text-[2.1rem] font-bold text-[#f39c12] mb-[7px]">25+</div>
                  <p>Years Experience</p>
                </div>
                <div className="flex-1 p-[18px]">
                  <div className="text-[2.1rem] font-bold text-[#f39c12] mb-[7px]">500+</div>
                  <p>Projects Completed</p>
                </div>
                <div className="flex-1 p-[18px]">
                  <div className="text-[2.1rem] font-bold text-[#f39c12] mb-[7px]">100%</div>
                  <p>Client Satisfaction</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 rounded-[10px] overflow-hidden shadow-[0_10px_32px_#0001] max-[992px]:order-1 group">
              <Image
                src="/img/info.jpg"
                alt="Craftsman at work"
                width={600}
                height={600}
                className="block w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" ref={el => { sectionsRef.current[1] = el }} className="fade-in py-[90px] bg-[#f8f9fa] text-center">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <h2 className="text-[2.3rem] font-bold text-[#222b36] mb-[22px] relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-[60px] after:h-[3px] after:bg-[#f39c12] after:rounded-sm max-[992px]:text-[1.4rem] max-[576px]:text-[1rem]">
            Our Services
          </h2>
          <p className="text-[1.08rem] mb-11">We offer a comprehensive range of metalwork services to meet your needs</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-11 max-[576px]:grid-cols-1">
            <div className="bg-white rounded-lg shadow-[0_6px_24px_#0001] transition-all duration-200 border border-[#f3f3f3] hover:-translate-y-[6px] hover:scale-[1.02] hover:shadow-[0_12px_32px_#0002]">
              <div className="text-[2.5rem] text-[#f39c12] mt-7">🪜</div>
              <div className="px-[22px] pb-7">
                <h3 className="text-[1.4rem] font-bold text-[#181c20] mb-[22px]">Staircases & Railings</h3>
                <p className="text-[1.08rem] leading-relaxed">Custom designed and built staircases and railings that combine safety with beautiful aesthetics for both interior and exterior applications.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-[0_6px_24px_#0001] transition-all duration-200 border border-[#f3f3f3] hover:-translate-y-[6px] hover:scale-[1.02] hover:shadow-[0_12px_32px_#0002]">
              <div className="text-[2.5rem] text-[#f39c12] mt-7">🏠</div>
              <div className="px-[22px] pb-7">
                <h3 className="text-[1.4rem] font-bold text-[#181c20] mb-[22px]">Gates & Fences</h3>
                <p className="text-[1.08rem] leading-relaxed">Security and style come together in our custom gates and fences, designed to complement your property while providing protection.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-[0_6px_24px_#0001] transition-all duration-200 border border-[#f3f3f3] hover:-translate-y-[6px] hover:scale-[1.02] hover:shadow-[0_12px_32px_#0002]">
              <div className="text-[2.5rem] text-[#f39c12] mt-7">🔧</div>
              <div className="px-[22px] pb-7">
                <h3 className="text-[1.4rem] font-bold text-[#181c20] mb-[22px]">Custom Fabrication</h3>
                <p className="text-[1.08rem] leading-relaxed">From art pieces to functional structures, we create custom metal fabrications tailored to your specific requirements and design preferences.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" ref={el => { sectionsRef.current[2] = el }} className="fade-in py-[90px] bg-white text-center">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <h2 className="text-[2.3rem] font-bold text-[#222b36] mb-[22px] relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-[60px] after:h-[3px] after:bg-[#f39c12] after:rounded-sm max-[992px]:text-[1.4rem] max-[576px]:text-[1rem]">
            Our Work
          </h2>
          <p className="text-[1.08rem] mb-11">Browse through some of our completed projects</p>
          
          <div className="mt-[28px]">
            <EmblaCarousel images={galleryImages} />
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-[#1e1e1eeb] flex items-center justify-center z-[2000]"
          style={{ animation: 'fadeIn 0.3s' }}
          onClick={() => setLightboxImage(null)}
        >
          <div className="max-w-[90vw] max-h-[80vh]">
            <Image
              src={lightboxImage}
              alt="Enlarged view"
              width={1200}
              height={900}
              className="max-w-full max-h-[80vh] rounded-lg shadow-[0_8px_32px_#0008] border-4 border-white"
              style={{ width: 'auto', height: '80vh', objectFit: 'contain' }}
              onClick={(e) => e.stopPropagation()}
              priority
            />
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <section id="reviews" ref={el => { sectionsRef.current[3] = el }} className="fade-in py-[90px] bg-[#f8f9fa] text-center">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <h2 className="text-[2.3rem] font-bold text-[#222b36] mb-[22px] relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-[60px] after:h-[3px] after:bg-[#f39c12] after:rounded-sm max-[992px]:text-[1.4rem] max-[576px]:text-[1rem]">
            Client Reviews
          </h2>
          <p className="text-[1.08rem] mb-11">See what our clients have to say about our work</p>
          
          <div className="max-w-[700px] mx-auto mt-[38px]">
            <div className="bg-white rounded-lg p-7 shadow-[0_6px_24px_#0001] text-left border border-[#f3f3f3]">
              <div className="flex items-center mb-[18px]">
                <div>
                  <h3 className="text-[1.15rem] mb-[3px] font-semibold">Emily McLanahan</h3>
                  <div className="text-[#f39c12] text-[1.1rem] tracking-[2px]">
                    ★★★★★
                  </div>
                </div>
              </div>
              <div className="italic text-[#555] leading-relaxed mb-[10px] text-[1.08rem]">
                <p>&quot;Fernando is a master. A magician. He took my idea and created a masterpiece of a railing. I am super super happy. I wanted something simple and elegant and he delivered exactly that. Hire him!&quot;</p>
              </div>
              <div className="text-right text-[0.93rem] text-[#888]">
                <p>December, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={el => { sectionsRef.current[4] = el }} className="fade-in py-[90px] bg-white">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <h2 className="text-[2.4rem] font-bold text-[#222b36] mb-[22px] relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-[60px] after:h-[3px] after:bg-[#f39c12] after:rounded-sm max-[992px]:text-[1.45rem] max-[576px]:text-[1.03rem]">
            Get In Touch
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-11">
            <div>
              <h3 className="text-[1.5rem] font-bold text-[#181c20] mb-[22px]">Contact Information</h3>
              
              <div className="flex items-center mb-4">
                <div className="text-[1.5rem] text-[#f39c12] mr-[14px] min-w-[40px] text-center">📍</div>
                <div>
                  <h4 className="text-[1.12rem] font-semibold mb-[4px]">Location</h4>
                  <p className="text-[1.05rem]">7300 Golden Ring Rd, Essex, MD 21221, USA</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="text-[1.5rem] text-[#f39c12] mr-[14px] min-w-[40px] text-center">📞</div>
                <div>
                  <h4 className="text-[1.12rem] font-semibold mb-[4px]">Phone</h4>
                  <p className="text-[1.05rem]">+1 (301) 547-5449</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="text-[1.5rem] text-[#f39c12] mr-[14px] min-w-[40px] text-center">🕒</div>
                <div>
                  <h4 className="text-[1.12rem] font-semibold mb-[4px]">Working Hours</h4>
                  <p className="text-[1.05rem]">Monday - Friday: 7AM - 5PM</p>
                </div>
              </div>
            </div>
            
            <div className="w-full min-h-[320px] rounded-lg overflow-hidden border border-[#f3f3f3]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3093.938138301855!2d-76.4791637!3d39.3303316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7c5176c4c0a15%3A0xa2ba8e4705c19e79!2sModel%20Ironworks%20LLC!5e0!3m2!1sen!2sbr!4v1618533913133!5m2!1sen!2sbr"
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: '320px' }}
                allowFullScreen={true} 
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#222b36] text-white pt-12">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 mb-7 max-[992px]:grid-cols-1">
            <div>
              <a href="#" className="text-[1.3rem] font-bold mb-3 text-[#f39c12] inline-block">
                Model IronWorks
              </a>
              <p className="mb-3 opacity-85 text-[1.01rem]">
                Quality craftsmanship and exceptional service in custom metalwork for over 25 years.
              </p>
            </div>
            <div>
              <h3 className="text-[#f39c12] text-[1.08rem] mb-[13px] font-semibold">Quick Links</h3>
              <ul className="list-none p-0">
                {navLinks.map((link) => (
                  <li key={link.href} className="mb-[7px]">
                    <a 
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="opacity-80 transition-all duration-200 hover:opacity-100 hover:text-[#f39c12]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="text-center py-4 border-t border-white/10 text-[0.97rem] opacity-70">
            <p>© 2025 Model IronWorks. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed right-6 bottom-8 bg-[#f39c12] text-white border-none rounded-full w-12 h-12 text-[1.7rem] shadow-[0_4px_16px_#0002] cursor-pointer z-[3000] transition-colors duration-200 hover:bg-[#d68910] flex items-center justify-center"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </>
  )
}