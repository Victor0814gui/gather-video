import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import ffmpegPath from 'ffmpeg-static';

const directoryPath = "./data"

function gatherFile(){
  fs.promises.readdir(directoryPath)
  .then((files) => {
    files.forEach((file) => {
      if (file.endsWith('.mp4') && file.includes('-audio.mp4')) {
        const videoFile = path.join(directoryPath, file.replace('-audio.mp4', '.mp4'));
        const audioFile = path.join(directoryPath, file);
        const outputFileName = file.replace('-audio.mp4', '-with-audio.mp4');
        const outputPath = path.join(directoryPath, outputFileName);

        const ffmpegArgs = [
          '-i', videoFile,
          '-i', audioFile,
          '-c:v', 'copy',
          '-c:a', 'aac',
          '-strict', 'experimental',
          '-map', '0:v:0',
          '-map', '1:a:0',
          outputPath,
        ];

        const ffmpegProcess = spawn(ffmpegPath, ffmpegArgs);

        ffmpegProcess.stdout.on('data', (data) => {
          console.log(`Saída: ${data}`);
        });

        ffmpegProcess.stderr.on('data', (data) => {
          console.error(`Erro: ${data}`);
        });

        ffmpegProcess.on('close', (code) => {
          if (code === 0) {
            console.log(`Arquivo gerado com sucesso: ${outputFileName}`);
            // Remover os arquivos de vídeo e áudio originais, se desejar
            // fs.promises.unlink(videoFile);
            // fs.promises.unlink(audioFile);
          } else {
            console.error(`Ocorreu um erro ao criar o arquivo ${outputFileName}`);
          }
        });
      }
    });
  })
  .catch((err) => {
    console.error('Erro ao ler o diretório:', err);
  });
}

gatherFile();
