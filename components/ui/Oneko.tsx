"use client";

import { useLayoutEffect, useRef } from "react";

const SPRITE_SETS: Record<string, [number, number][]> = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  scratchSelf: [
    [-5, 0],
    [-6, 0],
    [-7, 0],
  ],
  scratchWallN: [
    [0, 0],
    [0, -1],
  ],
  scratchWallS: [
    [-7, -1],
    [-6, -2],
  ],
  scratchWallE: [
    [-2, -2],
    [-2, -3],
  ],
  scratchWallW: [
    [-4, 0],
    [-4, -1],
  ],
  tired: [[-3, -2]],
  sleeping: [
    [-2, 0],
    [-2, -1],
  ],
  N: [
    [-1, -2],
    [-1, -3],
  ],
  NE: [
    [0, -2],
    [0, -3],
  ],
  E: [
    [-3, 0],
    [-3, -1],
  ],
  SE: [
    [-5, -1],
    [-5, -2],
  ],
  S: [
    [-6, -3],
    [-7, -2],
  ],
  SW: [
    [-5, -3],
    [-6, -1],
  ],
  W: [
    [-4, -2],
    [-4, -3],
  ],
  NW: [
    [-1, 0],
    [-1, -1],
  ],
};

export default function Oneko() {
  const nekoRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const isReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    const nekoEl = nekoRef.current;
    if (!nekoEl) return;

    let nekoPosX = 32;
    let nekoPosY = 32;
    let mousePosX = 0;
    let mousePosY = 0;
    let realMouseX = 0;
    let realMouseY = 0;
    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation: string | null = null;
    let idleAnimationFrame = 0;
    let forceSleep = true;
    let onLogo = true;
    let grabbing = false;
    let grabStop = true;
    let nudge = false;
    let clicksToWake = 0;
    const nekoSpeed = 10;

    function setSprite(name: string, frame: number) {
      const spriteSet = SPRITE_SETS[name];
      if (!spriteSet) return;
      const sprite = spriteSet[frame % spriteSet.length];
      nekoEl!.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
    }

    function resetIdleAnimation() {
      idleAnimation = null;
      idleAnimationFrame = 0;
    }

    function positionOnLogo() {
      const el = document.getElementById("logo-three");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      nekoPosX = rect.left + rect.width / 2.1;
      nekoPosY = rect.top + rect.height * 0.16;
      mousePosX = nekoPosX;
      mousePosY = nekoPosY;
      nekoEl!.style.left = `${nekoPosX - 16}px`;
      nekoEl!.style.top = `${nekoPosY - 16}px`;
      nekoEl!.style.opacity = "1";
    }

    function wake() {
      forceSleep = false;
      onLogo = false;
      clicksToWake = 0;
      resetIdleAnimation();
      mousePosX = realMouseX;
      mousePosY = realMouseY;
    }

    idleAnimation = "sleeping";
    idleAnimationFrame = 8;
    positionOnLogo();
    setSprite("sleeping", 0);
    document.fonts.ready.then(() => {
      if (onLogo) positionOnLogo();
    });

    function idle() {
      idleTime += 1;

      if (
        idleTime > 10 &&
        Math.floor(Math.random() * 200) === 0 &&
        idleAnimation === null
      ) {
        const available: string[] = ["sleeping", "scratchSelf"];
        if (nekoPosX < 32) available.push("scratchWallW");
        if (nekoPosY < 32) available.push("scratchWallN");
        if (nekoPosX > window.innerWidth - 32) available.push("scratchWallE");
        if (nekoPosY > window.innerHeight - 32) available.push("scratchWallS");
        idleAnimation = available[Math.floor(Math.random() * available.length)];
      }

      if (forceSleep) {
        idleAnimation = "sleeping";
      }

      switch (idleAnimation) {
        case "sleeping":
          if (idleAnimationFrame < 8 && nudge && forceSleep) {
            setSprite("idle", 0);
            break;
          } else if (nudge) {
            nudge = false;
            resetIdleAnimation();
          }
          if (idleAnimationFrame < 8) {
            setSprite("tired", 0);
            break;
          }
          setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
          if (idleAnimationFrame > 192 && !forceSleep) resetIdleAnimation();
          break;
        case "scratchWallN":
        case "scratchWallS":
        case "scratchWallE":
        case "scratchWallW":
        case "scratchSelf":
          setSprite(idleAnimation, idleAnimationFrame);
          if (idleAnimationFrame > 9) resetIdleAnimation();
          break;
        default:
          setSprite("idle", 0);
          return;
      }
      idleAnimationFrame += 1;
    }

    function frame() {
      frameCount += 1;

      if (grabbing) {
        if (grabStop) setSprite("alert", 0);
        return;
      }

      const diffX = nekoPosX - mousePosX;
      const diffY = nekoPosY - mousePosY;
      const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

      if (forceSleep && Math.abs(diffY) < nekoSpeed && Math.abs(diffX) < nekoSpeed) {
        nekoPosX = mousePosX;
        nekoPosY = mousePosY;
        nekoEl!.style.left = `${nekoPosX - 16}px`;
        nekoEl!.style.top = `${nekoPosY - 16}px`;
        idle();
        return;
      }

      if ((distance < nekoSpeed || distance < 48) && !forceSleep) {
        idle();
        return;
      }

      idleAnimation = null;
      idleAnimationFrame = 0;

      if (idleTime > 1) {
        setSprite("alert", 0);
        idleTime = Math.min(idleTime, 7);
        idleTime -= 1;
        return;
      }

      let direction = diffY / distance > 0.5 ? "N" : "";
      direction += diffY / distance < -0.5 ? "S" : "";
      direction += diffX / distance > 0.5 ? "W" : "";
      direction += diffX / distance < -0.5 ? "E" : "";
      setSprite(direction, frameCount);

      nekoPosX -= (diffX / distance) * nekoSpeed;
      nekoPosY -= (diffY / distance) * nekoSpeed;

      nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
      nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

      nekoEl!.style.left = `${nekoPosX - 16}px`;
      nekoEl!.style.top = `${nekoPosY - 16}px`;
    }

    // --- Event handlers ---

    const onNekoClick = (e: MouseEvent) => {
      if (!forceSleep) return;
      e.stopPropagation();
      clicksToWake++;
      if (clicksToWake >= 2) wake();
    };

    const onMouseMove = (e: MouseEvent) => {
      realMouseX = e.clientX;
      realMouseY = e.clientY;
      if (forceSleep) return;
      mousePosX = e.clientX;
      mousePosY = e.clientY;
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (onLogo) return;
      grabbing = true;
      let startX = e.clientX;
      let startY = e.clientY;
      let startNekoX = nekoPosX;
      let startNekoY = nekoPosY;
      let grabTimer: ReturnType<typeof setTimeout>;

      const onGrabMove = (ev: MouseEvent) => {
        const deltaX = ev.clientX - startX;
        const deltaY = ev.clientY - startY;
        const absDX = Math.abs(deltaX);
        const absDY = Math.abs(deltaY);

        if (absDX > absDY && absDX > 10) {
          setSprite(deltaX > 0 ? "scratchWallW" : "scratchWallE", frameCount);
        } else if (absDY > absDX && absDY > 10) {
          setSprite(deltaY > 0 ? "scratchWallN" : "scratchWallS", frameCount);
        }

        if (grabStop || absDX > 10 || absDY > 10 || Math.sqrt(deltaX ** 2 + deltaY ** 2) > 10) {
          grabStop = false;
          clearTimeout(grabTimer);
          grabTimer = setTimeout(() => {
            grabStop = true;
            nudge = false;
            startX = ev.clientX;
            startY = ev.clientY;
            startNekoX = nekoPosX;
            startNekoY = nekoPosY;
          }, 150);
        }

        nekoPosX = startNekoX + ev.clientX - startX;
        nekoPosY = startNekoY + ev.clientY - startY;
        nekoEl!.style.left = `${nekoPosX - 16}px`;
        nekoEl!.style.top = `${nekoPosY - 16}px`;
      };

      const onGrabUp = () => {
        grabbing = false;
        if (forceSleep) {
          mousePosX = nekoPosX;
          mousePosY = nekoPosY;
        } else {
          nudge = true;
          resetIdleAnimation();
        }
        window.removeEventListener("mousemove", onGrabMove);
        window.removeEventListener("mouseup", onGrabUp);
      };

      window.addEventListener("mousemove", onGrabMove);
      window.addEventListener("mouseup", onGrabUp);
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      if (onLogo) return;
      forceSleep = !forceSleep;
      clicksToWake = 0;
      nudge = false;
      if (forceSleep) {
        mousePosX = nekoPosX;
        mousePosY = nekoPosY;
      } else {
        resetIdleAnimation();
        mousePosX = realMouseX;
        mousePosY = realMouseY;
      }
    };

    const onResize = () => {
      if (onLogo) positionOnLogo();
    };

    const onScroll = () => {
      if (onLogo) positionOnLogo();
    };

    nekoEl.addEventListener("click", onNekoClick);
    document.addEventListener("mousemove", onMouseMove);
    nekoEl.addEventListener("mousedown", onMouseDown);
    nekoEl.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    const interval = setInterval(frame, 100);

    return () => {
      nekoEl.removeEventListener("click", onNekoClick);
      document.removeEventListener("mousemove", onMouseMove);
      nekoEl.removeEventListener("mousedown", onMouseDown);
      nekoEl.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      ref={nekoRef}
      aria-hidden="true"
      className="neko-glow"
      style={{
        width: 32,
        height: 32,
        position: "fixed",
        pointerEvents: "auto",
        backgroundImage: "url('/img/oneko.gif')",
        imageRendering: "pixelated",
        left: -9999,
        top: -9999,
        opacity: 0,
        zIndex: 2147483647,
        cursor: "grab",
      }}
    />
  );
}
