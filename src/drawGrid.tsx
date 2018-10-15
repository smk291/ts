import App from './App';
import { canvasParams } from './App';

export type DrawGridFn = (this: App) => void;

export const drawGrid: DrawGridFn = function(this: App ) {
  
  const canvas = this.canvas.current;
  const ctx = canvas && canvas.getContext('2d');
  const { step, w, h, offset } = canvasParams;

  if (!canvas || !ctx) return;
  
  ctx.beginPath(); 

  for (let x=0;x<=w;x+=step) {
    if (x === 1) x++
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }

  ctx.strokeStyle = '#d0d0d0';
  ctx.lineWidth = 0.5;
  ctx.stroke(); 

  ctx.beginPath(); 

  for (let y=0;y<=h;y+=step) {
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  
  ctx.strokeStyle = '#d0d0d0';
  ctx.lineWidth = 0.5;

  ctx.stroke(); 
  
  ctx.beginPath();
  ctx.moveTo(offset, 0);
  ctx.lineTo(offset, h);

  ctx.strokeStyle = 'rgba(0,0,0,1.0)';
  ctx.lineWidth = 0.5

  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, h - offset);
  ctx.lineTo(w, h - offset);

  
  ctx.stroke();
};
