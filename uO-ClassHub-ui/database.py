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
    li_elements = soup.select('.courseblock')
   # print(len(li_elements))
    sc_sccoursedescs = soup.find(class_='page_content')
    faculty = ""
    if(sc_sccoursedescs ):
        previous_sibling = sc_sccoursedescs.find('p')
       # print( previous_sibling.get_text() )
        faculty = previous_sibling.get_text().strip()

    for element in li_elements:
        course = ['coursename', 'coursedesc','faculty','coursedetails','prerequisites']  # Create a new list for each course
        title_element = element.select_one('.courseblocktitle')
        course_desc = element.select_one('.courseblockdesc')
        course_details = element.select_one('.courseblockextra')
        course_prerequisites = element.find(class_='courseblockextra highlight noindent')
        name = title_element.get_text().strip().replace("\xa0", " ")

        if course_desc is None:
            course[1] = "There's no description for this course"
        else:
            description_text = course_desc.get_text().strip()
            course[1] = description_text
        if(course_details is None):
            course[3] = ""
        else:
            course_details_text = course_details.get_text().strip()
            course[3] = course_details_text
        if(course_prerequisites is None):
            course[4] = "This course has no prerequisites"
        else:
            prerequisites_text = course_prerequisites.get_text().strip()
            course[4] = prerequisites_text
          #  print(prerequisites_text)

        course[0] = name
        course[2] = faculty
        course_names.append(course)

    return course_names




async def main():
    try:
        connection = sqlite3.connect('courses_database.db')
        cursor = connection.cursor()

        course_codes = await scrape_course_codes()
        cursor.execute('''DROP TABLE courseInformation''')
        cursor.execute('''CREATE TABLE courseInformation(faculty, course_code, course_desc, course_details, prerequisites)''')
     #course_name course_code



        for course in course_codes:
           # print(course)
            courseSliced = course[-4:-1].lower()
            course_names = await scrape_course_names(courseSliced)
           # print(course_names[0])
            for courseName in course_names:
                i = 0
               # print(courseName)
                cursor.execute(''' INSERT INTO courseInformation  VALUES (?, ?, ?, ?, ?)''', (courseName[2], courseName[0], courseName[1], courseName[3], courseName[4]))
            # Insert course names into the corresponding columns
       
        data  = cursor.execute(''' SELECT * FROM courseInformation''').fetchall()
        print(json.dumps(data))
       # print('he')
        connection.commit()
        connection.close()
    except Exception as error:
        print('An error occurred during web scraping:', error)


# Run the event loop
if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
