package logger

import (
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
)

var (
	file *os.File
	err  error
)

func init() {
	wd, err := os.Getwd()
	if err != nil {
		panic("failed to get working directory: " + err.Error())
	}

	dataDir := filepath.Join(wd, "data")
	if err := os.MkdirAll(dataDir, 0755); err != nil {
		panic("failed to create data directory: " + err.Error())
	}

	logPath := filepath.Join(dataDir, "app.log")

	file, err = os.OpenFile(logPath, os.O_RDWR|os.O_APPEND|os.O_CREATE, 0666)
	if err != nil {
		panic("open log file error: " + err.Error())
	}

	log.SetOutput(file)
}

type Logger struct {
	output io.Writer
	logger *log.Logger
}

func NewLogger(prefix string) Logger {
	return NewLoggerWithName(file, prefix)
}

func NewLoggerWithName(w io.Writer, prefix string) Logger {
	logger := log.New(w, fmt.Sprintf("[%s]\t", prefix), log.Ldate|log.Ltime|log.Lshortfile|log.LstdFlags)
	return Logger{
		output: w,
		logger: logger,
	}
}

func (l *Logger) Info(msg string) {
	l.logger.Printf("[INFO]\t%s\n", msg)
}

func (l *Logger) Infof(format string, args ...interface{}) {
	l.Info(fmt.Sprintf(format, args...))
}

func (l *Logger) Error(msg string, err error) {
	l.logger.Printf("[ERROR]\t%s: %v\n", msg, err)
}

func (l *Logger) Errorf(err error, format string, args ...interface{}) {
	l.Error(fmt.Sprintf(format, args...), err)
}

func (l *Logger) Success(msg string) {
	l.logger.Printf("[SUCCESS]\t%s\n", msg)
}

func (l *Logger) Successf(format string, args ...interface{}) {
	l.Success(fmt.Sprintf(format, args...))
}

func (l *Logger) CloseLogFile() error {
	if file != nil {
		return file.Close()
	}
	return nil
}

func (l *Logger) Warn(msg string) {
	l.logger.Printf("[WARN]\t%s\n", msg)
}

func (l *Logger) Warnf(format string, args ...interface{}) {
	l.Warn(fmt.Sprintf(format, args...))
}

func (l *Logger) Debug(msg string) {
	l.logger.Printf("[DEBUG]\t%s\n", msg)
}

func (l *Logger) Debugf(format string, args ...interface{}) {
	l.Debug(fmt.Sprintf(format, args...))
}

func (l *Logger) Fatal(msg string) {
	l.logger.Fatalf("[FATAL]\t%s\n", msg)
}

func (l *Logger) Fatalf(format string, args ...interface{}) {
	l.Fatal(fmt.Sprintf(format, args...))
}
