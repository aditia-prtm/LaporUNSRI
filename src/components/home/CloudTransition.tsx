import { motion, useScroll, useTransform } from 'framer-motion'
import awan1 from '../../assets/home/awan-1.png'
import awan2 from '../../assets/home/awan-2.png'
import awan3 from '../../assets/home/awan-3.png'
import awan4 from '../../assets/home/awan-4.png'
import awan5 from '../../assets/home/awan-5.png'

export function CloudTransition() {
  const { scrollY } = useScroll()

  // Layered parallax speeds for realistic 3D cloud volume
  const backLayerY = useTransform(scrollY, [0, 1000], [0, -60])
  const midLayerY = useTransform(scrollY, [0, 1000], [0, -30])
  const frontLayerY = useTransform(scrollY, [0, 1000], [0, -10])

  return (
    <div
      className="relative z-20 w-full overflow-x-clip overflow-y-visible pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Cloud Stage: Generous height allowing fluffy natural cloud tops to rise cleanly over hero */}
      <div className="relative w-full h-[440px] sm:h-[540px] md:h-[620px] lg:h-[700px] flex items-end overflow-visible">

        {/* Layer 1: Ambient High Cloud Silhouettes (Back Layer) */}
        <motion.div
          style={{ y: backLayerY }}
          className="absolute inset-0 size-full pointer-events-none"
        >
          {/* Cloud 2 - High Left Silhouette */}
          <img
            src={awan2}
            alt=""
            className="absolute -left-[10%] sm:-left-[5%] bottom-[260px] sm:bottom-[340px] md:bottom-[400px] w-[50vw] min-w-[340px] max-w-[700px] opacity-75 object-contain"
          />

          {/* Cloud 5 - High Center Silhouette */}
          <img
            src={awan5}
            alt=""
            className="absolute left-[26%] sm:left-[30%] bottom-[280px] sm:bottom-[360px] md:bottom-[420px] w-[46vw] min-w-[320px] max-w-[660px] opacity-70 object-contain"
          />

          {/* Cloud 1 - High Right Silhouette */}
          <img
            src={awan1}
            alt=""
            className="absolute -right-[8%] sm:-right-[4%] bottom-[270px] sm:bottom-[350px] md:bottom-[410px] w-[52vw] min-w-[350px] max-w-[720px] opacity-75 object-contain"
          />
        </motion.div>

        {/* Layer 2: Massive Volumetric Body (Dense Middle Deck) */}
        <motion.div
          style={{ y: midLayerY }}
          className="absolute inset-0 size-full pointer-events-none"
        >
          {/* Cloud 4 - Dense Left Shoulder */}
          <img
            src={awan4}
            alt=""
            className="absolute -left-[6%] sm:-left-[2%] bottom-[140px] sm:bottom-[180px] md:bottom-[220px] w-[55vw] min-w-[380px] max-w-[820px] opacity-90 brightness-[1.03] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)]"
          />

          {/* Cloud 3 - Grand Centerpiece (Kubah Padat Utama) */}
          <img
            src={awan3}
            alt=""
            className="absolute left-1/2 -translate-x-1/2 bottom-[160px] sm:bottom-[210px] md:bottom-[250px] w-[75vw] min-w-[500px] max-w-[1100px] opacity-95 brightness-[1.05] object-contain drop-shadow-[0_18px_36px_rgba(0,0,0,0.3)]"
          />

          {/* Cloud 2 - Dense Right Shoulder */}
          <img
            src={awan2}
            alt=""
            className="absolute -right-[6%] sm:-right-[2%] bottom-[150px] sm:bottom-[190px] md:bottom-[230px] w-[54vw] min-w-[370px] max-w-[800px] opacity-90 brightness-[1.03] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)]"
          />
        </motion.div>

        {/* Layer 3: Solid Foreground Bed (Full-width dense seal with zero gaps) */}
        <motion.div
          style={{ y: frontLayerY }}
          className="absolute inset-x-0 bottom-0 size-full pointer-events-none"
        >
          {/* Cloud 1 - Dense Foreground Left */}
          <img
            src={awan1}
            alt=""
            className="absolute -left-[8%] sm:-left-[3%] bottom-[30px] sm:bottom-[50px] w-[58vw] min-w-[400px] max-w-[880px] opacity-95 brightness-[1.04] object-contain"
          />

          {/* Cloud 3 - Dense Foreground Center-Left */}
          <img
            src={awan3}
            alt=""
            className="absolute left-[14%] sm:left-[18%] bottom-[20px] sm:bottom-[35px] w-[62vw] min-w-[430px] max-w-[920px] opacity-100 brightness-[1.06] object-contain"
          />

          {/* Cloud 4 - Dense Foreground Center-Right */}
          <img
            src={awan4}
            alt=""
            className="absolute left-[40%] sm:left-[44%] bottom-[25px] sm:bottom-[40px] w-[60vw] min-w-[420px] max-w-[900px] opacity-100 brightness-[1.06] object-contain"
          />

          {/* Cloud 5 - Dense Foreground Far Right */}
          <img
            src={awan5}
            alt=""
            className="absolute -right-[8%] sm:-right-[3%] bottom-[35px] sm:bottom-[55px] w-[56vw] min-w-[390px] max-w-[840px] opacity-95 brightness-[1.04] object-contain"
          />
        </motion.div>

        {/* Soft atmospheric gradient base: Merges the pure white cloud foundation directly into the deep #051d38 background */}
        <div
          className="absolute inset-x-0 bottom-0 h-[180px] sm:h-[240px] md:h-[300px] bg-gradient-to-t from-[#051d38] via-[#051d38]/85 to-transparent pointer-events-none z-10"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
