command_exists() {
    command -v "$1" >/dev/null 2>&1
}

if command_exists node; then
    node_dir="$(dirname "$(command -v node)")"
    export PATH="$node_dir:$PATH"
fi

# Workaround for Windows 10, Git Bash and Yarn
if command_exists winpty && test -t 1; then
    exec </dev/tty
fi
