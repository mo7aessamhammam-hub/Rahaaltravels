import { useEffect } from 'react';
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import { CustomCursor } from './components/layout/CustomCursor';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { BookingProvider } from './contexts/BookingContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Home } from './pages/Home';
import { startSmoothScroll } from './utils/smoothScroll';

export function App() {
  useEffect(() => startSmoothScroll(), []);

  return (
    <LanguageProvider>
      <BookingProvider>
        {/* `m` components + domAnimation only: no layout/drag engine, much smaller bundle. */}
        <LazyMotion features={domAnimation} strict>
          <MotionConfig reducedMotion="user">
            <ScrollProgress />
            <CustomCursor />
            <Home />
          </MotionConfig>
        </LazyMotion>
      </BookingProvider>
    </LanguageProvider>);

}