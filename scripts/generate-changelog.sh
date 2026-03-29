#!/bin/bash
# Generate CHANGELOG.md from git history
# Run: bash scripts/generate-changelog.sh
# Automatically groups commits by phase and generates a readable changelog.

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="$REPO_ROOT/CHANGELOG.md"

cat > "$OUTPUT" << 'HEADER'
# Changelog

All notable changes to "Історія як гра" (History as a Game) are documented in this file.

**Auto-generated** from git history. Run `bash scripts/generate-changelog.sh` to update.

HEADER

# Get all tags (if any) for version-based grouping
# For now, group by date ranges based on project phases

echo "## Recent Changes" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Get commits grouped by date (newest first)
current_date=""
git -C "$REPO_ROOT" log --format="%H|%as|%s" --no-merges | while IFS='|' read -r hash date subject; do
    if [ "$date" != "$current_date" ]; then
        current_date="$date"
        echo "### $date" >> "$OUTPUT"
        echo "" >> "$OUTPUT"
    fi

    short_hash="${hash:0:7}"

    # Categorize commit by prefix/content
    category=""
    case "$subject" in
        feat:*|feat\(*) category="✦ " ;;
        fix:*|fix\(*)   category="⚑ " ;;
        docs:*|docs\(*) category="📄 " ;;
        chore:*|chore\(*) category="⚙ " ;;
        assets:*)       category="🖼 " ;;
        refactor:*|Refactor*) category="♻ " ;;
        AR*|ar*|Ar*)    category="📱 " ;;
        Add\ files*|Add\ changes*) category="📦 " ;;
        *)              category="" ;;
    esac

    echo "- ${category}\`${short_hash}\` ${subject}" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
done

echo "" >> "$OUTPUT"
echo "---" >> "$OUTPUT"
echo "*Generated on $(date +%Y-%m-%d) from $(git -C "$REPO_ROOT" rev-list --count HEAD) commits.*" >> "$OUTPUT"

echo "CHANGELOG.md updated ($OUTPUT)"
