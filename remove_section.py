from pathlib import Path

path = Path('src/components/views/ManufacturerDashboard.tsx')
lines = path.read_text(encoding='utf-8').splitlines()

start_marker = '            {/* FULL WIDTH SECTION 1: Verification Documents Upload */}'
end_marker = '            {/* FULL WIDTH SECTION 2: LINK / REGISTER PROFESSIONAL ACCOUNT OPTION */}'

start_idx = None
end_idx = None

for i, line in enumerate(lines):
    if start_marker in line:
        start_idx = i
    if end_marker in line:
        end_idx = i
        break

if start_idx is not None and end_idx is not None:
    new_lines = lines[:start_idx] + lines[end_idx:]
    path.write_text('\n'.join(new_lines), encoding='utf-8')
    print(f'Removed lines {start_idx+1} to {end_idx} (inclusive)')
else:
    print('Markers not found')
