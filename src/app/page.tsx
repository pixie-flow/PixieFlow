"use client";
import { useEffect, useRef } from 'react';
import './styles/global.css';

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 四角形を描画する
    ctx.fillStyle = '#333';  // 暗い灰色
    ctx.fillRect(0, 0, canvas.width, canvas.height); // 四角形の塗りつぶし
  }, []);

  return (
    <div className="container">
      {/* ヘッダー部分 */}
      <header className="header">
        <div className="left">component</div>
        <div className="right">
          <span>save</span>
          <span>publish</span>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="content">
        {/* Canvas 部分 */}
        <div className="canvas-container">
          <canvas ref={canvasRef} width={300} height={400} />
        </div>

        {/* ボックスがある部分 */}
        <div className="box-container">
          <div className="box" />
        </div>
      </div>
    </div>
  );
};

export default Home;
