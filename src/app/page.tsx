"use client";
import React, { useEffect, useRef, useState } from 'react';
import './styles/global.css';
import { NodeBox } from '../components/NodeBox';
import { ConnectionLines } from '../components/ConnectionLines';
import { useNodeSystem } from '../hooks/useNodeSystem';
import vertexShader from './shaders/vertex.wgsl';
import fragmentShader from './shaders/fragment.wgsl';
import { ComponentSelector } from '../components/ComponentSelector';

const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeSystem = useNodeSystem();
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  useEffect(() => {
    const initializeWebGPU = async () => {
      const canvas = canvasRef.current;
      if(!canvas){
        throw new Error()
      }
      // WebGPU が GPU ハードウェアにアクセスするために adapter をリクエストする
      const adapter = await navigator.gpu.requestAdapter()

      if (!adapter) {
        // WebGPU 未対応環境の対応箇所A
        throw new Error()
      }

      // WebGPU が GPUコマンドの実行や、メモリの割り当てを行うためにデバイスをリクエストする
      // device が nullish になることはない(型定義を見る限り)
      const device = await adapter.requestDevice()

      // WebGPU コンテキストを取得
      const context = canvas.getContext('webgpu')
      if(!context){
        throw new Error()
      }

      const { devicePixelRatio } = window
      canvas.width = devicePixelRatio * canvas.clientWidth
      canvas.height = devicePixelRatio * canvas.clientHeight

      // WebGPU が推奨する canvas のカラーフォーマットを取得
      const presentationFormat = navigator.gpu.getPreferredCanvasFormat()

      // GPUデバイスと context を関連付ける
      context.configure({
        // 使用する GPU デバイスを指定
        device,
        // カラーフォーマットを指定
        format: presentationFormat,
        // アルファブレンディングのモードを指定
        alphaMode: 'premultiplied',
      })

      // レンダーパイプラインを作成
      // vertex|fragment shader が組み合わされ、描画処理が定義される
      const pipeline = device.createRenderPipeline({
        // パイプラインレイアウトを自動で設定する
        layout: 'auto',
        // vertex shader の設定
        vertex: {
          module: device.createShaderModule({
            code: vertexShader,
          }),
        },
        // fragment shader の設定
        fragment: {
          module: device.createShaderModule({
            code: fragmentShader,
          }),
          // レンダーターゲットの設定
          targets: [
            {
              // レンダーターゲットのカラーフォーマットを指定
              format: presentationFormat,
            },
          ],
        },
        primitive: {
          // 描画する primitive のトポロジーを指定
          topology: 'triangle-list',
        },
      })

      function frame() {
        // 複数のGPUコマンドをバッチ処理するために GPU command を生成
        const commandEncoder = device.createCommandEncoder()

        if (!context) {
          // WebGPU 未対応環境の対応箇所B
          throw new Error()
        }

        // レンダリング結果を表示するためのテクスチャを取得
        const textureView = context.getCurrentTexture().createView()

        const renderPassDescriptor: GPURenderPassDescriptor = {
          colorAttachments: [
            {
              view: textureView,
              // 背景を定
              clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
              // ロード操作を指定
              // 'load': 前のフレームからの描画結果が維持
              // 'clear': 新しいフレームを描画する前に
              //    GPURenderPassDescriptor.colorAttachments.clearValue
              //    で指定された色で初期化
              loadOp: 'clear' as GPULoadOp,
              // ストア操作を指定
              // この場合レンダリング結果を保存するように設定している
              storeOp: 'store' as GPUStoreOp,
            },
          ],
        }

        // GPUコマンドの記録開始
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
        // レンダーパイプラインを設定
        // これによ、使用するシェーダーとレンダリング設定が指定される
        passEncoder.setPipeline(pipeline)
        // レンダリング開始
        passEncoder.draw(3)
        // GPUコマンドの記録終了
        passEncoder.end()

        // コマンドを GPUキューに送信し GPUコマンド を実行
        device.queue.submit([commandEncoder.finish()])

        requestAnimationFrame(frame)
      }

      requestAnimationFrame(frame)
    };

    initializeWebGPU();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <div className="left">Component Editor</div>
        <div className="right">
          <button 
            onClick={() => setIsSelectorOpen(true)} 
            className="button primary"
          >
            Add Node
          </button>
          <button className="button">Save</button>
          <button className="button">Publish</button>
        </div>
      </header>

      <div className="content">
        <div className="canvas-container">
          <canvas 
            ref={canvasRef}
            className="webgpu-canvas"
          />
        </div>
        
        <div className="node-system-container">
          <div 
            className="canvas"
            onMouseMove={nodeSystem.updateDraggingConnection}
            onMouseUp={nodeSystem.clearDraggingConnection}
          >
            <ConnectionLines
              nodes={nodeSystem.nodes}
              draggingConnection={nodeSystem.draggingConnection}
            />
            
            {Object.entries(nodeSystem.nodes).map(([id, node]) => (
              <NodeBox
                key={id}
                id={id}
                node={node}
                position={node.position}
                onDrag={nodeSystem.updateNodePosition}
                onStartConnection={nodeSystem.startConnection}
                onEndConnection={nodeSystem.endConnection}
              />
            ))}
          </div>
        </div>
      </div>

      <ComponentSelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelect={(componentType) => {
          const id = `node-${Date.now()}`;
          nodeSystem.addNode(id, {
            x: Math.random() * 300,
            y: Math.random() * 200,
            componentType,
          });
        }}
      />
    </div>
  );
};

export default Home;
