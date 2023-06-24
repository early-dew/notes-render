REM Build frontend
cd notesfrontend
npm install
npm run build

REM Build backend
cd ..\notebackend
npm install
npm run build