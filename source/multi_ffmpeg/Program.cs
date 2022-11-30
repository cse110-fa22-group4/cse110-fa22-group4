using System.Collections.Concurrent;
using System.Diagnostics;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using TextCopy;
// ReSharper disable All

var input = Environment.GetCommandLineArgs();
var inputFilePath = string.Empty;
var outputFilePath = string.Empty;
var ffprobePath = string.Empty;
var clipboard = false;
var thread = false;

for (var i = 0; i < input.Length; i++)
{
    if (input[i].Equals("-i") || input[i].Equals("--input"))
    {
        i++;
        if (i == input.Length || !File.Exists(input[i]))
        {
            Console.Error.WriteLine("Invalid input file!");
            return -10;
        }

        if (!inputFilePath.Equals(string.Empty))
        {
            Console.Error.WriteLine("Input file specified twice!");
            return -11;
        }
        inputFilePath = input[i];
    }

    if (input[i].Equals("-o") || input[i].Equals("--output"))
    {
        i++;
        if (i == input.Length)
        {
            Console.Error.WriteLine("Invalid output file!");
            return -20;
        }

        try
        {
            var _ = Path.GetFullPath(input[i]);
        }
        catch (Exception e)
        {
            Console.Error.WriteLine("Invalid output file!");
            return -20;
        }

        if (!outputFilePath.Equals(string.Empty))
        {
            Console.Error.WriteLine("Output file specified twice!");
            return -21;
        }
        outputFilePath = input[i];
    }

    if (input[i].Equals("-p") || input[i].Equals("--probe"))
    {
        i++;
        if (i == input.Length || !File.Exists(input[i]))
        {
            Console.Error.WriteLine("File does not exist!");
            return -30;
        }

        if (!ffprobePath.Equals(string.Empty))
        {
            Console.Error.WriteLine("FFProbe path specified twice!");
            return -31;
        }

        ffprobePath = input[i];
    }


    if (input[i].Equals("-c") || input[i].Equals("--clipboard"))
    {
        clipboard = true;
    }

    if (input[i].Equals("-t") || input[i].Equals("--thread"))
    {
        thread = true;
    }

    if (input[i].Equals("-h") || input[i].Equals("--help"))
    {  
        Console.Out.WriteLine("\n");
        Console.Out.WriteLine("This app runs ffprobe on all paths (newline separated) in the given input file, \n" +
                              "and outputs a json formatted result in the given output file.");
        Console.Out.WriteLine("--------------------------------------------------------------------------------");
        Console.Out.WriteLine("-i  --input     :   Specifies the path to the input file.  *Required");
        Console.Out.WriteLine("-o  --output    :   Specifies the path to the output file. *Required");
        Console.Out.WriteLine("-p  --probe     :   Specifies the path to FFProbe.         *Required");
        Console.Out.WriteLine("-t  --thread    :   Will multithread. Good for many files.");
        Console.Out.WriteLine("-c  --clipboard :   Saves the output to clipboard.");
        Console.Out.WriteLine("-h  --help      :   Prints a help message.");
        return 1;
    }

}

if (inputFilePath.Equals(string.Empty) || outputFilePath.Equals(string.Empty) || ffprobePath.Equals(string.Empty))
{
    Console.Error.WriteLine("Required inputs not specified! Try running with -h or --help for more info.");
    Console.Error.WriteLine("Given input: " + string.Join(" ", input));
    Console.Error.WriteLine(
        "Missing: " + 
        (inputFilePath.Equals(string.Empty)  ? "Input File " : "") +
        (outputFilePath.Equals(string.Empty) ? "Output File " : "") + 
        (ffprobePath.Equals(string.Empty)    ? "Probe Path " : ""));
    return -1;
} else {
Console.Out.WriteLine("Input file: " + inputFilePath + ",\nOutput file: " + outputFilePath +
    ",\nProbe path: " + ffprobePath);
}

var fs = File.Open(inputFilePath, FileMode.Open);
var buf = new byte[fs.Length];
fs.Read(buf, 0, buf.Length);
var files = (new string(Encoding.UTF8.GetChars(buf))).Split('\n');
for (int i = 0; i < files.Length; i++)
{
    files[i] = string.Join("", files[i].Split('\r'));
}


var result = new ConcurrentBag<string>();
const string arguments = " -hide_banner -print_format json -show_format -i ";
var timer = new Stopwatch();

async Task<string> getFileData(string filePath)
{
    return await Task.Run(() =>
    {
        if (filePath == null || filePath.Equals(string.Empty) || filePath.Length == 0)
        {
            return "";
        }

        if (!filePath[0].Equals('\"'))
        {
            filePath = '\"' + filePath + '\"';
        }
        using var cmd = new Process();
        cmd.StartInfo.FileName = ffprobePath;
        cmd.StartInfo.Arguments = arguments + filePath;
        cmd.StartInfo.RedirectStandardOutput = true;
        cmd.StartInfo.RedirectStandardError = true;
        cmd.StartInfo.UseShellExecute = false;
        cmd.StartInfo.CreateNoWindow = false;

        cmd.Start();

        var output = new StringBuilder();
        var error = new StringBuilder();

        using var outputWaitHandle = new AutoResetEvent(false);
        using var errorWaitHandle = new AutoResetEvent(false);
        cmd.OutputDataReceived += (sender, e) =>
        {
            if (e.Data == null)
            {
                outputWaitHandle.Set();
            }
            else
            {
                output.Append(e.Data);
            }
        };
        cmd.ErrorDataReceived += (sender, e) =>
        {
            if (e.Data == null)
            {
                errorWaitHandle.Set();
            }
            else
            {
                error.AppendLine(e.Data);
            }
        };

        cmd.Start();

        cmd.BeginOutputReadLine();
        cmd.BeginErrorReadLine();

        const int timeout = 1000;
        if (
            cmd.WaitForExit(timeout) &&
            outputWaitHandle.WaitOne(timeout) &&
            errorWaitHandle.WaitOne(timeout))
        {
            if (!output.ToString().Equals(""))
            {

                return filePath.Replace('\\', '/') + ": " + output.ToString();

            }
            return "";
        }
        else
        {
            return "";
        }
    });
}



try
{
    timer.Start();

    if (thread)
    {
        await Parallel.ForEachAsync(Enumerable.Range(0, files.Length).ToArray(), async (i, token) =>
        {
            result.Add(await getFileData(files[i]));
            Console.Write("\r{0}%         ", Math.Round(i * 100f / (double)files.Length, 2));
        });
    }

    else
    {
        for (var i = 0; i < files.Length; i++)
        {
            result.Add(await getFileData(files[i]));
            Console.Write("\r{0}%         ", Math.Round(i * 100f / (double)files.Length, 2));
        }
    }

    Console.Out.Write("\r100%             \n");
    Console.Out.WriteLine("Milliseconds per file: " + timer.ElapsedMilliseconds / (double)(files.Length - 1));
    Console.Out.WriteLine("Total files parsed: " + files.Length);
    var text = '{' + string.Join(",", result.Where(s => !s.Equals(""))) + '}';

    if (clipboard) ClipboardService.SetText(text);

    return 1;
}
catch (Exception e)
{
    Console.Error.WriteLine(e.ToString());
    return -1;
}



