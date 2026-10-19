'use client';
import TouchFlourish from './TouchFlourish';

// Ambient layer behind every page: touch ripples.
// (MatrixRain removed 2026-10-12 per user request — component file kept.)
export default function Ambient() {
  return (
    <>
      <TouchFlourish />
    </>
  );
}
