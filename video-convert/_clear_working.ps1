
# remove all files from ./working/extracted but leave the directory structure intact and info.md
Get-ChildItem -Path ./working/export -Recurse -Exclude info.md | Remove-Item -Force -Recurse
Get-ChildItem -Path ./working/extracted -Recurse -Exclude info.md | Remove-Item -Force -Recurse
Get-ChildItem -Path ./working/rawvideos -Recurse -Exclude info.md | Remove-Item -Force -Recurse
Get-ChildItem -Path ./working/transcriptions -Recurse -Exclude info.md | Remove-Item -Force -Recurse
Get-ChildItem -Path ./working/tts -Recurse -Exclude info.md | Remove-Item -Force -Recurse
Get-ChildItem -Path ./working/uploads -Recurse -Exclude info.md | Remove-Item -Force -Recurse
# delete working/log
Remove-Item -Path ./working/log.txt -Force