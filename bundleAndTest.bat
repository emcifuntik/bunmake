@echo off
setlocal

bun build --compile --minify --sourcemap --bytecode --target=bun-windows-x64 ./src/index.ts --outfile ./bin/bunmake.exe

pushd test
..\bin\bunmake.exe --bo=./build --g=vs2022
popd

endlocal