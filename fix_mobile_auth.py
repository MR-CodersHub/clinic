
import os

def update_mobile_menu_auth():
    directory = "."
    files_to_update = [f for f in os.listdir(directory) if f.endswith(".html")]
    
    target_block = """          <div class="grid grid-cols-2 gap-4" id="mobile-auth-links">
             <a href="login.html" class="flex items-center justify-center gap-2 py-4 border border-gray-100 rounded-2xl text-sm font-bold text-clinic-trust bg-white shadow-sm">
                <i data-lucide="log-in" class="w-4 h-4"></i> Login
             </a>
             <a href="signup.html" class="flex items-center justify-center gap-2 py-4 border border-gray-100 rounded-2xl text-sm font-bold text-clinic-trust bg-white shadow-sm">
                <i data-lucide="user-plus" class="w-4 h-4"></i> Sign Up
             </a>
          </div>
          <div id="mobile-user-info" class="hidden space-y-4">
             <a href="user-dashboard.html" class="flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl text-sm font-bold text-clinic-trust bg-white shadow-sm" id="mobile-dashboard-link">
                <i data-lucide="layout-dashboard" class="w-4 h-4"></i> Dashboard
             </a>
             <button class="w-full flex items-center justify-center gap-3 py-4 border border-red-100 rounded-2xl text-sm font-bold text-red-500 bg-red-50" id="mobile-logout-btn">
                <i data-lucide="log-out" class="w-4 h-4"></i> Logout
             </button>
          </div>"""

    old_block_pattern = '<div class="grid grid-cols-2 gap-4">\n             <a href="login.html"'

    for filename in files_to_update:
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if old_block_pattern in content and 'id="mobile-auth-links"' not in content:
            # Simple replacement logic for this specific structure
            start_index = content.find(old_block_pattern)
            end_search = '</div>\n        </div>\n      </div>\n    </div>'
            # We need to find the specific closing div of the grid
            # In our case, the grid block ends after the signup link div
            grid_end_tag = '</a>\n          </div>'
            grid_end_index = content.find(grid_end_tag, start_index)
            if grid_end_index != -1:
                 content = content[:start_index] + target_block + content[grid_end_index + len(grid_end_tag):]
                 with open(filepath, 'w', encoding='utf-8') as f:
                     f.write(content)
                 print(f"Updated {filename}")

if __name__ == "__main__":
    update_mobile_menu_auth()
