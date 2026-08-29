Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
strAppDir = fso.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = strAppDir
WshShell.Run "cmd /c """ & strAppDir & "\Hoc_Tieng_Tang_Sara.bat""", 0, False
