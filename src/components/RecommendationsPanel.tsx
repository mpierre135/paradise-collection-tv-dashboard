"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Recommendation } from "@/src/types";

type RecommendationsPanelProps = {
  recommendations: Recommendation[];
};

const VISIBLE_COUNT = 4;

export function RecommendationsPanel({ recommendations }: RecommendationsPanelProps) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (recommendations.length <= VISIBLE_COUNT) {
      return;
    }

    const timer = setInterval(() => {
      setOffset((current) => (current + VISIBLE_COUNT) % recommendations.length);
    }, 12000);

    return () => clearInterval(timer);
  }, [recommendations.length]);

  const visibleRecommendations = useMemo(() => {
    if (recommendations.length <= VISIBLE_COUNT) {
      return recommendations;
    }

    const rotated = [...recommendations.slice(offset), ...recommendations.slice(0, offset)];
    return rotated.slice(0, VISIBLE_COUNT);
  }, [offset, recommendations]);

  if (!recommendations.length) {
    return null;
  }

  return (
    <section className="tv-card">
      <p className="tv-kicker">Explore Nearby</p>
      <h3 className="tv-title">Curated Local Favorites</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visibleRecommendations.map((recommendation) => (
            <motion.article
              key={recommendation.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-white/15 bg-white/10 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.16em] text-[#bfe0d8]">{recommendation.category}</p>
                {recommendation.distance ? <p className="text-sm text-white/70">{recommendation.distance}</p> : null}
              </div>
              <h4 className="mt-1 text-2xl font-semibold text-white">{recommendation.name}</h4>
              <p className="mt-2 text-lg text-white/80">{recommendation.description}</p>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
