import aiohttp
import asyncio
from bs4 import BeautifulSoup
import sqlite3
import re
import json
# Function to sanitize column names
def sanitize_column_name(name):
    # Remove any non-alphanumeric characters
    sanitized_name = re.sub(r'\W+', '', name)
    # Add a prefix if the name starts with a number
    if sanitized_name[0].isdigit():
        sanitized_name = 'col_' + sanitized_name
    return sanitized_name

async def scrape_course_codes():
    url = 'https://catalogue.uottawa.ca/en/courses/'
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            data = await response.text()

    course_codes = []
    soup = BeautifulSoup(data, 'html.parser')
    li_elements = soup.select('.az_sitemap li:not(.azMenu li)')

    for element in li_elements:
        code = element.get_text().strip()
        course_codes.append(code)

    return course_codes

async def scrape_course_names(courseCode):
    url = 'https://catalogue.uottawa.ca/en/courses/' + courseCode + "/"
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            data = await response.text()

    course_names = []
    soup = BeautifulSoup(data, 'html.parser')
    li_elements = soup.select('.courseblocktitle')

    for element in li_elements:
        name = element.get_text().strip()
        course_names.append(name)

    return course_names

async def main():
    try:
        connection = sqlite3.connect('courses_database.db')
        cursor = connection.cursor()

        course_codes = await scrape_course_codes()
        cursor.execute('''DROP TABLE courses''')
        cursor.execute('''CREATE TABLE courses(course_name, course_code)''')
     #course_name course_code



        for course in course_codes:
           # print(course)
            courseSliced = course[-4:-1].lower()
            course_names = await scrape_course_names(courseSliced)
            
            for courseName in course_names:
                cursor.execute(''' INSERT INTO courses  VALUES (?, ?)''', (course, courseName.replace('\xa0', ' ')))
            # Insert course names into the corresponding columns
       
        data  = cursor.execute(''' SELECT * FROM courses''').fetchall()
       # print(json.dumps(data))
        print(data)
        connection.commit()
        connection.close()
    except Exception as error:
        print('An error occurred during web scraping:', error)


# Run the event loop
if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
