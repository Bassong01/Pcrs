import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'

const INK = [21, 32, 43]
const MUTED = [110, 122, 130]
const LINE = [220, 229, 228]

function formatFromDataURL(dataUrl) {
    const match = /^data:image\/(png|jpeg|jpg|webp)/i.exec(dataUrl || '')
    const type = (match?.[1] || 'jpeg').toLowerCase()
    if (type === 'jpg') return 'JPEG'
    return type.toUpperCase()
}

async function fetchAsDataURL(url) {
    if (!url) return null
    try {
        const response = await fetch(url, { mode: 'cors' })
        if (!response.ok) return null
        const blob = await response.blob()
        if (!blob.type.startsWith('image/')) return null
        return await new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
    } catch {
        return null
    }
}

function drawHeader(doc, pageWidth, kicker, heading) {
    doc.setFillColor(15, 23, 32)
    doc.rect(0, 0, pageWidth, 86, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('NATIONAL CRIMINAL RECORDS · OPERATIONS CONSOLE', pageWidth / 2, 28, { align: 'center' })
    doc.setFontSize(24)
    doc.text(heading, pageWidth / 2, 54, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(kicker, pageWidth / 2, 71, { align: 'center' })
    doc.setTextColor(...INK)
}

function field(doc, x, y, label, value, width) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...MUTED)
    doc.text(label.toUpperCase(), x, y)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10.5)
    doc.setTextColor(...INK)
    const text = value === null || value === undefined || value === '' ? 'Not recorded' : String(value)
    doc.text(doc.splitTextToSize(text, width || 200), x, y + 13)
}

function footer(doc, pageWidth, pageHeight, generatedNote) {
    doc.setDrawColor(...LINE)
    doc.line(40, pageHeight - 46, pageWidth - 40, pageHeight - 46)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...MUTED)
    doc.text(generatedNote, 40, pageHeight - 32)
    doc.text('This document is for authorized operational use only.', 40, pageHeight - 20)
}

export async function exportWantedPoster(alert, person = null) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    const firstName = person?.first_name || (alert.person_name ? alert.person_name.split(' ')[0] : '') || ''
    const lastName = person?.last_name || (alert.person_name ? alert.person_name.split(' ').slice(1).join(' ') : '') || ''
    const alias = person?.alias || alert.alias || ''
    const photoUrl = person?.photo_url || alert.photo_url || ''
    const displayName = `${firstName} ${lastName}`.trim() || 'Unidentified suspect'

    const [photoData, qrData] = await Promise.all([
        fetchAsDataURL(photoUrl),
        QRCode.toDataURL(`PCRS-ALERT:${alert.alert_ref || alert.id}`, { margin: 1, width: 240 }),
    ])

    drawHeader(doc, pageWidth, 'Wanted alert — authorized for public / interdepartmental distribution', 'WANTED')

    const photoX = 40, photoY = 116, photoSize = 150
    doc.setDrawColor(...LINE)
    doc.rect(photoX, photoY, photoSize, photoSize)
    if (photoData) {
        try { doc.addImage(photoData, formatFromDataURL(photoData), photoX, photoY, photoSize, photoSize) } catch { /* unsupported format */ }
    } else {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(...MUTED)
        doc.text('No photo on file', photoX + photoSize / 2, photoY + photoSize / 2, { align: 'center' })
        doc.setTextColor(...INK)
    }

    const qrSize = 90
    doc.addImage(qrData, 'PNG', pageWidth - 40 - qrSize, photoY, qrSize, qrSize)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...MUTED)
    doc.text('Scan to verify alert reference', pageWidth - 40 - qrSize / 2, photoY + qrSize + 12, { align: 'center' })
    doc.setTextColor(...INK)

    const infoX = photoX + photoSize + 24
    const infoWidth = pageWidth - 40 - qrSize - 12 - infoX
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(19)
    doc.text(displayName, infoX, photoY + 18)
    if (alias) {
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(11)
        doc.setTextColor(...MUTED)
        doc.text(`"${alias}"`, infoX, photoY + 36)
        doc.setTextColor(...INK)
    }

    let y = photoY + (alias ? 58 : 46)
    field(doc, infoX, y, 'Alert reference', alert.alert_ref || `#${alert.id}`, infoWidth)
    field(doc, infoX + infoWidth / 2, y, 'Priority', (alert.priority || 'medium').toUpperCase(), infoWidth / 2)
    y += 36
    field(doc, infoX, y, 'Status', (alert.status || 'pending').replaceAll('_', ' ').toUpperCase(), infoWidth)
    y += 36
    field(doc, infoX, y, 'Last known location', alert.last_known_loc, infoWidth)

    y = photoY + photoSize + 36
    doc.setDrawColor(...LINE)
    doc.line(40, y, pageWidth - 40, y)
    y += 26

    field(doc, 40, y, 'Reason for alert', alert.reason, pageWidth - 80)
    y += 46
    field(doc, 40, y, 'Description', alert.description, pageWidth - 80)
    y += 62

    const colWidth = (pageWidth - 80 - 24) / 2
    field(doc, 40, y, 'Region', alert.region, colWidth)
    field(doc, 40 + colWidth + 24, y, 'Station', alert.station, colWidth)
    y += 36
    field(doc, 40, y, 'Case reference', alert.case_ref || alert.case_id, colWidth)
    field(doc, 40 + colWidth + 24, y, 'Issued by', alert.issued_by_name, colWidth)

    footer(doc, pageWidth, pageHeight, `Generated ${new Date().toLocaleString()} · PCRS Operations Console`)

    doc.save(`wanted-poster-${(alert.alert_ref || alert.id).toString().replaceAll(/\s+/g, '-')}.pdf`)
}

export async function exportCaseSummary(caseData) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    const qrData = await QRCode.toDataURL(`PCRS-CASE:${caseData.reference_no || caseData.id}`, { margin: 1, width: 240 })

    drawHeader(doc, pageWidth, 'Case file summary — internal investigation record', caseData.reference_no || `CASE #${caseData.id}`)

    let y = 116
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text(doc.splitTextToSize(caseData.title || 'Untitled case', pageWidth - 40 - 100 - 20), 40, y)

    const qrSize = 80
    doc.addImage(qrData, 'PNG', pageWidth - 40 - qrSize, 96, qrSize, qrSize)

    y += 30
    const colWidth = (pageWidth - 80 - 24) / 2
    field(doc, 40, y, 'Nature', caseData.nature, colWidth)
    field(doc, 40 + colWidth + 24, y, 'Status', (caseData.status || 'open').replaceAll('_', ' ').toUpperCase(), colWidth)
    y += 36
    field(doc, 40, y, 'Region', caseData.region, colWidth)
    field(doc, 40 + colWidth + 24, y, 'Incident date', caseData.incident_date ? new Date(caseData.incident_date).toLocaleDateString() : '', colWidth)
    y += 36
    field(doc, 40, y, 'Location', caseData.location, pageWidth - 80)
    y += 46
    field(doc, 40, y, 'Description', caseData.description, pageWidth - 80)
    y += 68

    doc.setDrawColor(...LINE)
    doc.line(40, y, pageWidth - 40, y)
    y += 22

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(`Persons linked to this case (${(caseData.persons || []).length})`, 40, y)
    y += 18

    const persons = caseData.persons || []
    if (!persons.length) {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(...MUTED)
        doc.text('No persons currently linked to this case.', 40, y)
        doc.setTextColor(...INK)
        y += 18
    }

    for (const person of persons) {
        if (y > pageHeight - 130) { doc.addPage(); y = 50 }
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10.5)
        doc.setTextColor(...INK)
        const name = `${person.first_name || ''} ${person.last_name || ''}`.trim() + (person.alias ? ` (${person.alias})` : '')
        doc.text(name, 40, y)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(...MUTED)
        doc.text(`${person.role_in_case || 'suspect'} · ${person.is_wanted ? 'Wanted' : 'Not currently wanted'}`, pageWidth - 40, y, { align: 'right' })
        doc.setTextColor(...INK)
        y += 15

        const records = person.criminal_records || []
        if (records.length) {
            for (const record of records) {
                if (y > pageHeight - 100) { doc.addPage(); y = 50 }
                doc.setFont('helvetica', 'normal')
                doc.setFontSize(9)
                doc.setTextColor(...MUTED)
                doc.text(`• ${record.offence} — ${record.verification_status || 'unverified'} — ${record.court || 'No court recorded'}`, 52, y)
                doc.setTextColor(...INK)
                y += 14
            }
        }
        y += 10
    }

    footer(doc, pageWidth, pageHeight, `Generated ${new Date().toLocaleString()} · PCRS Operations Console`)

    doc.save(`case-file-${(caseData.reference_no || caseData.id).toString().replaceAll(/\s+/g, '-')}.pdf`)
}
