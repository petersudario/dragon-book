<?php

namespace App\Helpers;

trait GenerateValidCpf
{
    /**
     * Gera um CPF válido.
     *
     * @return string
     */
    public function generateValidCpf()
    {
        $cpf = '';

        // Gera os primeiros 9 dígitos
        for ($i = 0; $i < 9; $i++) {
            $cpf .= mt_rand(0, 9);
        }

        // Calcula o primeiro dígito verificador
        $sum = 0;
        for ($i = 0, $weight = 10; $i < 9; $i++, $weight--) {
            $sum += $cpf[$i] * $weight;
        }
        $remainder = $sum % 11;
        $digit1 = ($remainder < 2) ? 0 : 11 - $remainder;
        $cpf .= $digit1;

        // Calcula o segundo dígito verificador
        $sum = 0;
        for ($i = 0, $weight = 11; $i < 10; $i++, $weight--) {
            $sum += $cpf[$i] * $weight;
        }
        $remainder = $sum % 11;
        $digit2 = ($remainder < 2) ? 0 : 11 - $remainder;
        $cpf .= $digit2;

        // Evita CPFs com todos os dígitos iguais
        if (preg_match('/(\d)\1{10}/', $cpf)) {
            return $this->generateValidCpf();
        }

        return $cpf;
    }
}
