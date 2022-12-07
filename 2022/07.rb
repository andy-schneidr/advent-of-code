module Day07
  $all_directories = Hash.new
  $total = 70000000
  $need = 30000000

  $max = 100000
  class << self
    def part_one(input)
      $all_directories = Hash.new
      root = parse(input)
      root.print("")
      total = 0
      $all_directories.each { |key, value|
        if value <= $max
          total += value
        end
      }
      puts $all_directories.to_s
      total
    end

    def part_two(input)
      $all_directories = Hash.new
      root = parse(input)
      root.print("")
      used = root.size
      free = $total - used
      need = $need - free

      smallest_best = used
      $all_directories.each { |key, value|
        if value <= smallest_best && value >= need
          smallest_best = value
        end
      }
      smallest_best
    end

    def parse(input)
      root = Directory.new("/", nil)
      # start by parsing the root
      current = root
      i = 1
      i.step(input.length - 1, 1) { |i|
        line = input[i]
        # puts line
        if line.start_with?("$ cd ..")
          # if cd .., change current directory to current directory's parent.
          # puts "Current - before: #{current}"
          current = current.parent
          # puts "Current - after: #{current}"
        elsif line.start_with?("$ cd")
          # if cd x, change current directory to current directory's child with name x.
          name = line.split(" ")[2]
          # puts "Current - before: #{current}"
          found = current.subdirs.select { |dir| dir.name == name }
          if found.length > 1
            puts "oh my GOD there's more than ONE!! #{current.name}: #{current}"
          end
          current = found[0]
          # puts "Current - after: #{current}"
        elsif line.start_with?("$ ls")
          # if ls, if directory has no files or subdirs,
          # puts "Current: #{current}"
          if current.subdirs.length == 0 &&
             current.files.length == 0
            j = i + 1
            #   enter a loop
            j.step(input.length - 1, 1) { |j|
              subline = input[j]
              if subline.start_with?("$")
                #     if starts with $, break
                break
                i = j - 1
              elsif subline.start_with?("d")
                #     if starts with d, add new directory to current directory
                dirname = subline.split(" ")[1]
                # puts "Adding directory #{dirname} to #{current.name}"
                current.add_child(Directory.new(dirname, current))
              else
                #     else, parse line as a file, add to current directory
                substrs = subline.split(" ")
                file = File.new(substrs[0].to_i, substrs[1])
                # puts "Adding file #{file.to_str} to #{current.name}"
                current.add_file(file)
              end
            }
          end
        end
      }

      return root
    end
  end

  class Directory
    attr_accessor :parent
    attr_accessor :subdirs
    attr_accessor :files
    attr_accessor :name

    def initialize(name, parent)
      @name = name
      @parent = parent
      @files = []
      @subdirs = []
    end

    def add_file(file)
      @files.append(file)
    end

    def add_child(dir)
      @subdirs.append(dir)
    end

    def size
      total = @files.sum(&:size)
      @subdirs.each do |dir|
        total += dir.size()
      end
      key = path
      $all_directories.store(key, total)
      total
    end

    def path
      if @parent == nil
        return @name
      end
      parent = @parent
      path_str = @name
      while parent.name != "/"
        path_str = "#{parent.name}/" + path_str
        parent = parent.parent
      end
      return path_str
    end

    def print(indent)
      puts "#{indent}- #{@name} (dir, size=#{size})"

      @files.each do |file|
        file.print(indent + "  ")
      end

      @subdirs.each do |dir|
        dir.print(indent + "  ")
      end
    end
  end

  class File
    attr_accessor :name
    attr_accessor :size

    def initialize(size, name)
      @size = size
      @name = name
    end

    def print(indent)
      puts "#{indent}- #{@name} (file, size=#{@size})"
    end

    def to_str()
      return "#{@name} (file, size=#{@size})"
    end
  end
end

lines = File.readlines("examples/07/07.txt")
puts Day07.part_one(lines)
puts Day07.part_two(lines)
lines = File.readlines("inputs/07.txt")
puts Day07.part_one(lines)
puts Day07.part_two(lines)
