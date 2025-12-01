// src/app/api/jobs/route.ts

// Этот файл является обработчиком API маршрута в Next.js. Он выполняется на стороне сервера.

import { NextResponse } from 'next/server'; // Для работы с ответами Next.js
import { Client } from '@elastic/elasticsearch'; // <-- Импорт клиента Elasticsearch для Node.js

// --- КОНФИГУРАЦИЯ КЛИЕНТА ELASTICSEARCH ---
// Вам нужно настроить подключение к вашему экземпляру Elasticsearch.
// Замените 'http://localhost:9200' на адрес вашего Elasticsearch.
// Если вы используете облачный Elastic Cloud или требуется аутентификация (логин/пароль, API Key),
// обратитесь к документации клиента @elastic/elasticsearch для правильной настройки.
const elasticClient = new Client({
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200', // Адрес Elasticsearch (можно взять из переменных окружения)
    // Пример настройки для Elastic Cloud:
    // cloud: { id: process.env.ELASTIC_CLOUD_ID! },
    // auth: { apiKey: process.env.ELASTIC_API_KEY! }
    // Пример настройки с логином/паролем:
    // auth: { username: process.env.ELASTICSEARCH_USERNAME!, password: process.env.ELASTICSEARCH_PASSWORD! }
});
// --- КОНЕЦ КОНФИГУРАЦИИ ---


// --- ОБРАБОТЧИК POST ЗАПРОСОВ ---
// Эта функция будет вызываться, когда на маршрут /api/jobs придет POST запрос (например, при отправке формы)
export async function POST(request: Request) {
    try {
        // 1. Получаем данные из тела запроса (которые отправила форма в формате JSON)
        const jobData = await request.json();

        console.log("Получены данные для новой вакансии:", jobData); // Логируем полученные данные

        // --- Подготовка данных перед индексацией (опционально, но часто нужно) ---
        // Преобразуем строку навыков в массив строк, если она есть
        const skillsArray = jobData.skills ? jobData.skills.split(',').map(skill => skill.trim()).filter(skill => skill !== '') : [];

        // Преобразуем зарплату в число, если она введена и является числом
        const salaryValue = jobData.salary ? parseFloat(jobData.salary) : undefined;
        const salaryForIndex = !isNaN(salaryValue as number) ? salaryValue : undefined; // Убедимся, что это число

        // Создаем объект документа для индексации, убеждаясь, что поля соответствуют вашему маппингу ES
        const documentToIndex = {
            title: jobData.title,
            description: jobData.description,
            company: jobData.company,
            location: jobData.location,
            salary: salaryForIndex, // Передаем число или undefined
            employment_type: jobData.employment_type || undefined, // Передаем строку или undefined
            remote_type: jobData.remote_type || undefined,
            experience_level: jobData.experience_level || undefined,
            skills: skillsArray, // Передаем массив строк или пустой массив
            // Добавьте все остальные поля, которые есть в вашем индексе и должны быть проиндексированы
            // Например: date_posted: new Date().toISOString(), // Дата добавления
        };
        // --- Конец подготовки данных ---


        // 2. Индексируем документ в Elasticsearch
        const indexResponse = await elasticClient.index({
            index: 'it_jobs', // Имя вашего индекса Elasticsearch
            // id: jobData.id || undefined, // Опционально: если у вас есть уникальный ID для документа
            document: documentToIndex, // Данные, которые будут проиндексированы
            refresh: 'wait_for' // Опционально: ждем, пока индекс обновится, чтобы документ стал сразу доступен для поиска
        });

        console.log("Ответ от Elasticsearch после индексации:", indexResponse); // Логируем ответ от ES

        // 3. Формируем ответ для фронтенда
        // Проверяем статус ответа от Elasticsearch (например, 'created' или 'updated')
        if (indexResponse.result === 'created' || indexResponse.result === 'updated') {
            // Отправляем успешный ответ фронтенду со статусом 201 (Created)
            return NextResponse.json({ message: 'Вакансия успешно добавлена', id: indexResponse.id }, { status: 201 });
        } else {
            // Если Elasticsearch вернул что-то другое, считаем это ошибкой индексации
            console.error("Индексация в Elasticsearch не удалась:", indexResponse);
            return NextResponse.json({ message: 'Не удалось проиндексировать вакансию в Elasticsearch' }, { status: 500 });
        }

    } catch (error: any) { // Ловим любые ошибки в процессе (получение данных, индексация и т.д.)
        console.error('Ошибка при обработке запроса на добавление вакансии:', error);
        // Отправляем ответ об ошибке фронтенду со статусом 500 (Internal Server Error)
        return NextResponse.json({ message: 'Внутренняя ошибка сервера', error: error.message }, { status: 500 });
    }
}

// Вы можете добавить другие обработчики HTTP методов (GET, PUT, DELETE) при необходимости
// export async function GET(request: Request) { ... }
// export async function PUT(request: Request) { ... }
// export async function DELETE(request: Request) { ... }