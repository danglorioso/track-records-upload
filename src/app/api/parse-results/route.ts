'use server'

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';

const execPromise = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    // Extract the form data
    const formData = await request.formData();
    
    // Get the uploaded file
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Get other form data
    const meetDate = formData.get('meetDate') as string;
    const edition = formData.get('edition') as string;
    const meetName = formData.get('meetName') as string;
    const meetLocation = formData.get('meetLocation') as string;
    const season = formData.get('season') as string;
    const url = formData.get('url') as string;
    const timing = formData.get('timing') as string;

    // Create a temporary file path to save the uploaded file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a temporary directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'tmp');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Save the file temporarily
    const filePath = path.join(uploadDir, file.name);
    await writeFile(filePath, buffer);
    
    // Execute the Python parser script with the file path and other parameters
    // Note: You'll need to adjust the script path and parameters according to your actual script
    const scriptPath = path.join(process.cwd(), 'python', 'parse_file.py');
    
    const command = `python3 ${scriptPath} --file "${filePath}" --date "${meetDate}" --edition "${edition}" --name "${meetName}" --location "${meetLocation}" --season "${season}" --url "${url}" --timing "${timing}"`;
    
    const { stdout, stderr } = await execPromise(command);
    
    if (stderr) {
      console.error('Python script stderr:', stderr);
      return NextResponse.json({ error: 'Error processing file', details: stderr }, { status: 500 });
    }
    
    // Parse the output from the Python script
    // Assuming the script outputs JSON data
    let parsedResults;
    try {
      parsedResults = JSON.parse(stdout);
    } catch (error) {
      console.error('Error parsing Python script output:', error);
      return NextResponse.json({ 
        error: 'Error parsing script output',
        rawOutput: stdout 
      }, { status: 500 });
    }
    
    // Return the processed data
    return NextResponse.json({
      message: 'File processed successfully',
      results: parsedResults,
      metadata: {
        meetDate,
        edition,
        meetName,
        meetLocation,
        season,
        url,
        timing,
        fileName: file.name
      }
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}