<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            $table->string('nome');
            $table->string('cpf');
            $table->string('telefone');
            $table->string('endereco');
            $table->string('cep');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->string('complemento')->nullable(); 
            
            $table->timestamps();

            $table->unique(['user_id', 'cpf']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('contacts');
    }
};
