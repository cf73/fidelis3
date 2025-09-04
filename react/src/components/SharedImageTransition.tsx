import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTransition } from '../contexts/TransitionContext';

interface SharedImageTransitionProps {
  productId: string;
  imageUrl: string | null;
  isDetailPage?: boolean;
  productSlug?: string;
}

export const SharedImageTransition: React.FC<SharedImageTransitionProps> = ({
  productId,
  imageUrl,
  isDetailPage = false,
  productSlug,
}) => {
  const { sharedElement, setSharedElement, isTransitioning, setIsTransitioning } = useTransition();
  const navigate = useNavigate();
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageClick = (e: React.MouseEvent) => {
    if (!imageUrl || isDetailPage) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = imageRef.current?.getBoundingClientRect();
    if (rect) {
      setSharedElement({
        id: productId,
        rect,
        image: imageUrl,
      });
      setIsTransitioning(true);

      // Navigate to detail page after a short delay to allow the transition to start
      setTimeout(() => {
        if (productSlug) {
          navigate(`/products/${productSlug}`);
        }
      }, 300);
    }
  };

  useEffect(() => {
    if (isDetailPage && sharedElement?.id === productId && isTransitioning) {
      // Transition to detail page
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setSharedElement(null);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isDetailPage, sharedElement, productId, isTransitioning, setIsTransitioning, setSharedElement]);

  const isShared = sharedElement?.id === productId;

  return (
    <>
      {/* Original Image */}
      <motion.img
        ref={imageRef}
        src={imageUrl || ''}
        alt="Product"
        className={`w-full h-full object-cover ${
          isDetailPage ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'
        } transition-opacity duration-500`}
        onClick={handleImageClick}
        style={{
          cursor: isDetailPage ? 'default' : 'pointer',
        }}
        animate={
          isShared && !isDetailPage
            ? {
                opacity: 0,
                scale: 0.8,
                transition: { duration: 0.3 },
              }
            : {}
        }
      />

      {/* Floating Transition Image */}
      <AnimatePresence>
        {isShared && isTransitioning && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.img
              src={imageUrl || ''}
              alt="Product"
              className="absolute object-cover"
              style={{
                width: sharedElement.rect?.width || 0,
                height: sharedElement.rect?.height || 0,
                left: sharedElement.rect?.left || 0,
                top: sharedElement.rect?.top || 0,
              }}
              animate={
                isDetailPage
                  ? {
                      width: '100%',
                      height: '100%',
                      left: 0,
                      top: 0,
                      transition: {
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    }
                  : {
                      width: '80vw',
                      height: '80vh',
                      left: '10vw',
                      top: '10vh',
                      transition: {
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      },
                    }
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
