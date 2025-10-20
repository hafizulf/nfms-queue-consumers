export function emailNotification(subject: string, verifyUrl: string) {
  const appName = 'NFMS';
  const title = `Pemberitahuan dari NFMS${subject ? ' - ' + subject : ''}`;
  const preheader = 'Tindakan diperlukan. Silakan buka tautan di bawah ini.';

  const body = `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${escapeHtml(title)}</title>
  <style>
    body,table,td,p{margin:0;padding:0}
    body{background:#f6f7fb;color:#111827;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
    .wrapper{width:100%;padding:24px}
    .container{max-width:600px;margin:0 auto}
    .card{background:#fff;border-radius:12px;overflow:hidden}
    .header{background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:20px;color:#fff;font-weight:700}
    .content{padding:20px}
    .title{font-size:18px;font-weight:700;margin:0 0 6px}
    .muted{color:#6b7280;font-size:14px;line-height:1.6}
    .btn{display:inline-block;margin-top:14px;background:#4f46e5;color:#fff !important;
         padding:12px 18px;border-radius:10px;font-weight:600}
    .link{color:#4f46e5;word-break:break-all}
    .footer{color:#9ca3af;font-size:12px;text-align:center;margin-top:12px}
    @media (prefers-color-scheme: dark){
      body{background:#0b0f14;color:#e5e7eb}
      .card{background:#111827}
      .muted{color:#9ca3af}
    }
  </style>
</head>
<body>
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}&nbsp;&zwnj;</div>
  <div class="wrapper">
    <div class="container">
      <div class="card">
        <div class="header">NFMS</div>
        <div class="content">
          <p class="title">${escapeHtml(title)}</p>
          <p class="muted">Silakan klik tombol di bawah untuk melanjutkan proses.</p>
          <!--[if mso]>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:14px"><tr><td bgcolor="#4f46e5" style="border-radius:10px">
            <a href="${verifyUrl}" style="display:inline-block;padding:12px 18px;color:#ffffff;font-weight:600">Buka Tautan</a>
          </td></tr></table>
          <![endif]-->
          <!--[if !mso]><!-- -->
          <a class="btn" href="${verifyUrl}" target="_blank" rel="noopener">Buka Tautan</a>
          <!--<![endif]-->
          <p class="muted" style="margin-top:14px">Jika tombol tidak berfungsi, salin dan tempel tautan ini:</p>
          <p><a class="link" href="${verifyUrl}" target="_blank" rel="noopener">${escapeHtml(verifyUrl)}</a></p>
          <p class="muted" style="margin-top:14px">Terima kasih,<br>Tim INSW</p>
        </div>
      </div>
      <div class="footer">
        Email ini dikirim otomatis. Anda tidak perlu membalas email ini.
      </div>
    </div>
  </div>
</body>
</html>`;

  return { subject: title, body };
}

// minimal escape for safety if subject contains special chars
function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}
