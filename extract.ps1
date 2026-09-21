$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("c:\Users\DORIAN\Desktop\RECORD SYSTEM\SOFTINFRA_TECH_Internship_Report_Name_Only.docx")
$text = $doc.Content.Text
$text | Out-File -FilePath "c:\Users\DORIAN\Desktop\RECORD SYSTEM\report_text.txt" -Encoding UTF8
$doc.Close([ref]$false)
$word.Quit()
