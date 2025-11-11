const templates = {
  javascript: `// JavaScript Hello World
console.log("Hello, World!");`,

  c: `// C Hello World
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,

  cpp: `// C++ Hello World
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,

  python: `# Python Hello World
print("Hello, World!")`,

  java: `// Java Hello World
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,

  csharp: `// C# Hello World
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,

  ruby: `# Ruby Hello World
puts "Hello, World!"`,

  php: `<?php
// PHP Hello World
echo "Hello, World!";
?>`,

  swift: `// Swift Hello World
print("Hello, World!")`,

  go: `// Go Hello World
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,

  rust: `// Rust Hello World
fn main() {
    println!("Hello, World!");
}`,

  kotlin: `// Kotlin Hello World
fun main() {
    println("Hello, World!")
}`,

  scala: `// Scala Hello World
object Main {
    def main(args: Array[String]): Unit = {
        println("Hello, World!")
    }
}`,

  perl: `# Perl Hello World
print "Hello, World!\\n";`,

  r: `# R Hello World
cat("Hello, World!\\n")`,

  typescript: `// TypeScript Hello World
console.log("Hello, World!");`,

  bash: `#!/bin/bash
# Bash Hello World
echo "Hello, World!"`,

  assembly: `; Assembly Hello World (NASM)
section .data
    msg db "Hello, World!", 0xA
    len equ $ - msg

section .text
    global _start

_start:
    mov eax, 4      ; sys_write
    mov ebx, 1      ; stdout
    mov ecx, msg    ; message
    mov edx, len    ; length
    int 0x80        ; call kernel

    mov eax, 1      ; sys_exit
    xor ebx, ebx    ; exit code 0
    int 0x80        ; call kernel`,

  basic: `' Basic Hello World
PRINT "Hello, World!"`,

  cobol: `      * COBOL Hello World
       IDENTIFICATION DIVISION.
       PROGRAM-ID. HELLO.
       PROCEDURE DIVISION.
           DISPLAY "Hello, World!".
           STOP RUN.`,
           
  lisp: `; Common Lisp Hello World
(format t "Hello, World!~%")`
};

// Function to get the Hello World template for a specific language
export const getHelloWorldTemplate = (language) => {
  // Default to JavaScript if the language is not found
  return templates[language] || templates.javascript;
};

// Export the templates for reference
export const HelloWorldTemplates = templates;
