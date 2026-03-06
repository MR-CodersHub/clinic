$dir = 'c:\Users\dines\OneDrive\Desktop\clinic-main'

$newBlock = @"
          <div id="profile-menu"
            class="hidden absolute right-0 mt-3 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-clinic-trust/5 py-2 z-[9999] opacity-0 transform -translate-y-2 transition-all duration-200"
            style="min-width:200px;">
            <!-- Login / Sign Up - single line -->
            <a href="login.html"
              class="flex items-center gap-2 px-4 py-2.5 text-sm text-clinic-ink hover:bg-clinic-mist transition-colors font-semibold rounded-t-xl">
              <i data-lucide="log-in" class="w-4 h-4 text-clinic-primary shrink-0"></i>
              <span class="whitespace-nowrap">Login&nbsp;/&nbsp;Sign Up</span>
            </a>
            <div class="h-px bg-gray-100 mx-3"></div>
            <!-- Admin Dashboard -->
            <a href="admin-dashboard.html"
              class="flex items-center gap-2 px-4 py-2.5 text-sm text-clinic-trust hover:bg-clinic-mist transition-colors font-semibold">
              <i data-lucide="shield" class="w-4 h-4 text-clinic-trust shrink-0"></i>
              <span class="whitespace-nowrap">Admin Dashboard</span>
            </a>
            <!-- User Dashboard -->
            <a href="user-dashboard.html"
              class="flex items-center gap-2 px-4 py-2.5 text-sm text-clinic-ink hover:bg-clinic-mist transition-colors font-semibold rounded-b-xl">
              <i data-lucide="layout-dashboard" class="w-4 h-4 text-clinic-primary shrink-0"></i>
              <span class="whitespace-nowrap">User Dashboard</span>
            </a>
          </div>
"@

$files = @(
  'about.html','contact.html','doctors.html','faq.html','booking.html',
  'error404.html','home-2.html','home-alt.html','maintenance.html',
  'privacy-policy.html','services.html','terms-of-use.html'
)

foreach ($f in $files) {
  $path = Join-Path $dir $f
  if (-not (Test-Path $path)) {
    Write-Host "NOT FOUND: $f"
    continue
  }

  $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

  # Find the start of the old profile-menu div
  $startPattern = '<div id="profile-menu"'
  $startIdx = $content.IndexOf($startPattern)
  if ($startIdx -lt 0) {
    Write-Host "No profile-menu found: $f"
    continue
  }

  # Find auth-links to confirm it's the old dropdown
  if ($content.IndexOf('id="auth-links"') -lt 0) {
    Write-Host "Already updated or different structure: $f"
    continue
  }

  # Count divs to find the matching closing tag
  # The old block starts at $startIdx
  # We need to find the closing </div> that closes profile-menu
  $depth = 0
  $i = $startIdx
  $endIdx = -1
  while ($i -lt $content.Length) {
    if ($content.Substring($i).StartsWith('<div')) {
      $depth++
      $i += 4
    } elseif ($content.Substring($i).StartsWith('</div>')) {
      $depth--
      if ($depth -eq 0) {
        $endIdx = $i + 6  # include the </div>
        break
      }
      $i += 6
    } else {
      $i++
    }
  }

  if ($endIdx -lt 0) {
    Write-Host "Could not find closing tag: $f"
    continue
  }

  # Replace the old block with new
  $before = $content.Substring(0, $startIdx)
  $after = $content.Substring($endIdx)
  $newContent = $before + $newBlock.TrimEnd() + $after

  [System.IO.File]::WriteAllText($path, $newContent, [System.Text.Encoding]::UTF8)
  Write-Host "Updated: $f"
}

Write-Host "`nDone!"
